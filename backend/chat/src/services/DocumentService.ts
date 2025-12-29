import { extractTextFromPdf } from '../utils/pdfUtils.js';
import VectorStore from '../core/VectorStore.js';
import DocumentRepository from '../repositories/DocumentRepository.js';
import { getEmbeddingProvider } from '../core/providers/providerFactory.js';
import {sleep} from "../utils/RequestUtils";
import {logger} from "../utils/logger";

const embeddingProvider = getEmbeddingProvider();
const documentRepository = new DocumentRepository();

// Token counting approximation for JavaScript
function countTokens(text: any) {
  // Approximation: ~4 characters per token (similar to tiktoken)
  return Math.ceil(text.length / 4);
}

function chunkText(text: any, maxTokens: number = 1500): string[] {
  const chunks: string[] = [];
  const lines = text.split('\n');
  let current: string[] = [];
  let tokensCount = 0;

  for (const line of lines) {
    const lineTokens = countTokens(line);
    if (tokensCount + lineTokens > maxTokens) {
      chunks.push(current.join('\n'));
      current = [];
      tokensCount = 0;
    }
    current.push(line);
    tokensCount += lineTokens;
  }

  if (current.length > 0) {
    chunks.push(current.join('\n'));
  }

  return chunks;
}

async function ingestPdf(fileBytes: any, filename: any, userId: number, chatId: any = null) {
  try {
    const pagesText = await extractTextFromPdf(fileBytes);

    const chunks = chunkText(pagesText);

    const documentId = await documentRepository.createDocument(userId, filename);

    const embeddings = await embeddingProvider.embedChunks(chunks);

    const vectorStore = new VectorStore();

    const savePromises = chunks.map((chunk, i) => {
      const metadata = {
        file_name: filename,
        chunk_index: i + 1,
        timestamp: new Date().toISOString(),
        user_id: userId,
        chat_id: chatId,
        document_id: documentId,
      };
      return vectorStore.add(chunk, metadata, embeddings[i]);
    });

    await Promise.all(savePromises);

    return {
      message: `Documento '${filename}' processado com sucesso.`,
      chunks_count: chunks.length,
      user_id: userId,
      document_id: documentId,
    };
  } catch (error: any) {
    logger.error(`Erro ao ingerir PDF: ${error.message}`);
    throw new Error(`Erro ao ingerir PDF: ${error.message}`);
  }
}

export { ingestPdf };

