import { extractTextFromPdf } from '../utils/pdfUtils.js';
import VectorStore from '../core/VectorStore.js';
import DocumentRepository from '../repositories/DocumentRepository.js';
import { getEmbeddingProvider } from '../core/providers/providerFactory.js';

const embeddingProvider = getEmbeddingProvider();
const documentRepository = new DocumentRepository();

// Token counting approximation for JavaScript
function countTokens(text) {
  // Approximation: ~4 characters per token (similar to tiktoken)
  return Math.ceil(text.length / 4);
}

function chunkText(text, maxTokens = 500) {
  const chunks = [];
  const lines = text.split('\n');
  let current = [];
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

async function ingestPdf(fileBytes, filename, userId, chatId = null) {
  try {
    // 1. Ler o PDF e dividir em chunks
    const text = await extractTextFromPdf(fileBytes);
    const chunks = chunkText(text);

    // 1.5. Persistir documento e obter document_id
    const documentId = await documentRepository.createDocument(userId, filename);

    // 2. Definir provedor via variável de ambiente
    const providerName = (process.env.EMBEDDING_PROVIDER || 'google').toLowerCase();
    const vectorStore = new VectorStore();

    // 3. Gerar embeddings e salvar
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = await embeddingProvider.embedText(chunk);
      const metadata = {
        file_name: filename,
        chunk_index: i + 1,
        timestamp: new Date().toISOString(),
        user_id: userId,
        chat_id: chatId,
        document_id: documentId,
      };
      await vectorStore.add(chunk, metadata, embedding);
    }

    return {
      message: `Documento '${filename}' processado com sucesso usando ${providerName.charAt(0).toUpperCase() + providerName.slice(1)}.`,
      chunks_count: chunks.length,
      user_id: userId,
      document_id: documentId,
    };
  } catch (error) {
    throw new Error(`Erro ao ingerir PDF: ${error.message}`);
  }
}

export { ingestPdf };
