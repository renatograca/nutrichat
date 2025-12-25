from app.core.providers.provider_factory import get_ai_provider

# Carrega o provedor correto (Google ou OpenAI)
embedding_provider = get_ai_provider()


def embed_text(text: str):
    """
    Gera embedding de um texto usando o provider configurado.
    """
    return embedding_provider.embed_text(text)
