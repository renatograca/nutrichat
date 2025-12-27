import VectorStore from '../core/VectorStore';
import { getAIProvider, getEmbeddingProvider } from '../core/providers/providerFactory';
import ChatRepository from '../repositories/ChatRepository';

const embeddingProvider = getEmbeddingProvider();
const aiProvider = getAIProvider();
const chatRepository = new ChatRepository();

async function askQuestion(question: any, userId: number, chatId: any = null, topK: any = 5) {
  try {
    // 1. Obter embedding da pergunta
    const queryEmbedding = await (embeddingProvider as any).embedText(question);

    // 1.5. Obter chat e garantir que existe document_id associado
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

    // 2. Buscar contexto no vector store filtrando por document_id
    const vectorStore = new VectorStore();
    const docs = await vectorStore.similaritySearch(queryEmbedding, {
      documentId,
      userId,
      chatId,
      topK,
    });
    const context = docs.map((d: any) => d.content).join('\n');

    // 3. Obter histórico recente se chat_id for fornecido
    let historyStr = '';
    if (chatId) {
      const messages = await chatRepository.getChatMessages(chatId, 10);
      historyStr = messages.map((m: any) => `${m.role}: ${m.content}`).join('\n');
    }

    // 4. Construir prompt com histórico e contexto
    const fullPrompt = `
Você é um assistente de nutrição amigável e informativo.
Responda exclusivamente com base no contexto do documento fornecido abaixo.
Se a resposta não existir no plano nutricional, informe que não possui essa informação.

Histórico da conversa:
${historyStr}

Contexto do Documento:
${context}

Pergunta:
${question}
`;

    // 5. Fazer pergunta ao modelo
    const response = await (aiProvider as any).chat(fullPrompt);

    return response;
  } catch (error: any) {
    throw new Error(`Erro ao fazer pergunta: ${error.message}`);
  }
}

export { askQuestion };

