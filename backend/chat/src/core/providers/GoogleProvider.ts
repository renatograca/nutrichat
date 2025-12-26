import { GoogleGenerativeAI } from '@google/generative-ai';
import BaseAIProvider from './BaseAIProvider';

class GoogleProvider extends BaseAIProvider {
  client: any;
  chatModel: any;
  embeddingModel: any;

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

  async embedText(text: any) {
    try {
      const result = await (this as any).embeddingModel.embedContent(text);
      return result.embedding.values;
    } catch (error: any) {
      throw new Error(`Erro ao gerar embedding: ${error.message}`);
    }
  }

  async askQuestion(question: any, context: any) {
    const prompt = `
Você é um assistente de nutrição amigável e informativo.
Responda usando apenas o contexto abaixo.
Se não souber, diga "Não tenho informações sobre isso no meu banco de dados nutricional".

CONTEXTO:
${context}

PERGUNTA:
${question}
    `;
    return this.chat(prompt);
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

