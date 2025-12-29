import {
  BatchEmbedContentsRequest,
  BatchEmbedContentsResponse,
  ContentEmbedding, EmbedContentRequest,
  GenerativeModel,
  GoogleGenerativeAI
} from '@google/generative-ai';
import BaseAIProvider from './BaseAIProvider.js';
import path from "path";
import fs from "fs";

class GoogleProvider extends BaseAIProvider {
  client: any;
  chatModel: any;
  embeddingModel: GenerativeModel;

  constructor() {
    super();
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY não está definida');
    }
    this.client = new GoogleGenerativeAI(apiKey);
    this.chatModel = this.client.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
    this.embeddingModel = this.client.getGenerativeModel({ model: 'gemini-embedding-001' });
  }

  async embedChunks(texts: string[]) {
    try {
      // O SDK oficial aceita um objeto com a propriedade requests
      const result = await this.embeddingModel.batchEmbedContents({
        requests: texts.map((t) => ({
          content: { role: 'user', parts: [{ text: t }] },
        })),
      });

      // Retorna apenas os arrays de valores numéricos
      return result.embeddings.map(e => e.values);
    } catch (error: any) {
      console.error("Erro no Batch Embedding:", error);
      throw new Error(`Erro ao gerar batch embedding: ${error.message}`);
    }
  }

  async askQuestion(history: string, context: string, question: string) {

    const promptPath = path.join(__dirname, '..', 'prompts', 'system_prompt.md');
    let fullPrompt = fs.readFileSync(promptPath, 'utf8');

    fullPrompt = fullPrompt
        .replace('{{historyStr}}', history)
        .replace('{{context}}', context)
        .replace('{{question}}', question);

    return this.chat(fullPrompt);
  }

  async chat(prompt: any) {
    try {
      const response = await (this as any).chatModel.generateContent(prompt);
      return response.response.text();
    } catch (error: any) {
      throw new Error(`Erro ao gerar resposta do chat: ${error.message}`);
    }
  }
}

export default GoogleProvider;

