import GoogleProvider from './GoogleProvider';

function getAIProvider() {
  const providerName = (process.env.AI_PROVIDER || 'google').toLowerCase();

  if (providerName === 'google') {
    return new GoogleProvider();
  }
  throw new Error(`Provider de IA desconhecido: ${providerName}`);
}

function getEmbeddingProvider() {
  const providerName = (process.env.EMBEDDING_PROVIDER || 'google').toLowerCase();

  if (providerName === 'google') {
    return new GoogleProvider();
  }
  throw new Error(`Provider de Embeddings desconhecido: ${providerName}`);
}

export { getAIProvider, getEmbeddingProvider };

