import VectorStore from '../core/VectorStore.js';
import { getAIProvider, getEmbeddingProvider } from '../core/providers/providerFactory.js';
import ChatRepository from '../repositories/ChatRepository.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const embeddingProvider = getEmbeddingProvider();
const aiProvider = getAIProvider();
const chatRepository = new ChatRepository();

async function askQuestion(question: any, userId: number, chatId: any = null, topK: any = 5) {
  try {
    const queryEmbedding = await (embeddingProvider as any).embedText(question);

    let documentId: any = null;
    if (chatId) {
      const chat = await chatRepository.getChat(chatId);
      if (!chat || chat.user_id !== userId) {
        throw new Error('Chat não encontrado ou não pertence ao usuário');
      }
      documentId = chat.document_id;
    }

    if (!documentId) {
      throw new Error('Chat não possui documento associado');
    }

    const vectorStore = new VectorStore();
    const docs = await vectorStore.similaritySearch(queryEmbedding, {
      documentId,
      userId,
      chatId,
      topK,
    });
    const context = docs.map((d: any) => d.content).join('\n');

    let historyStr = '';
    if (chatId) {
      const messages = await chatRepository.getChatMessages(chatId, 10);
      historyStr = messages.map((m: any) => `${m.role}: ${m.content}`).join('\n');
    }

    return await aiProvider.askQuestion(historyStr, context, question);

  } catch (error: any) {
    throw new Error(`Erro ao fazer pergunta: ${error.message}`);
  }
}

export { askQuestion };

