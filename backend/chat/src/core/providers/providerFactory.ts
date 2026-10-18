import GoogleProvider from './GoogleProvider.js';

function getAIProvider(): GoogleProvider {
  const providerName = (process.env.AI_PROVIDER || 'google').toLowerCase();

  if (providerName === 'google') {
    return new GoogleProvider();
  }
  throw new Error(`Provider de IA desconhecido: ${providerName}`);
}

function getEmbeddingProvider(): GoogleProvider {
  const providerName = (process.env.EMBEDDING_PROVIDER || 'google').toLowerCase();

  if (providerName === 'google') {
    return new GoogleProvider();
  }
  throw new Error(`Provider de Embeddings desconhecido: ${providerName}`);
}

export { getAIProvider, getEmbeddingProvider };

