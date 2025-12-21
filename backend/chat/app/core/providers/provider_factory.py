import os

# from app.core.providers.openai_provider import OpenAIProvider
from app.core.providers.google_provider import GoogleProvider
from app.core.providers.local_embedding_provider import LocalEmbeddingProvider


def get_ai_provider():
    provider_name = os.getenv("AI_PROVIDER", "google").lower()

    if provider_name == "google":
        return GoogleProvider()
    # elif provider_name == "openai":
    #     return OpenAIProvider()
    else:
        raise ValueError(f"Provider de IA desconhecido: {provider_name}")


def get_embedding_provider():
    provider_name = os.getenv("EMBEDDING_PROVIDER", "google").lower()

    return LocalEmbeddingProvider()
    if provider_name == "google":
        return GoogleProvider()
    # elif provider_name == "openai":
    #     return OpenAIProvider()
    else:
        raise ValueError(f"Provider de Embeddings desconhecido: {provider_name}")
