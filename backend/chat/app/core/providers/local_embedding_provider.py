from sentence_transformers import SentenceTransformer
from app.core.providers.base_provider import BaseAIProvider


class LocalEmbeddingProvider(BaseAIProvider):
    def __init__(self):
        # Modelo leve, rápido e roda offline
        self.model = SentenceTransformer("sentence-transformers/all-mpnet-base-v2")

    def embed_text(self, text: str) -> list[float]:
        """Gera embeddings localmente"""
        return self.model.encode(text).tolist()

    def ask_question(self, question: str, context: str) -> str:
        """
        Esse provedor é apenas para embeddings locais.
        O processamento de perguntas continua sendo feito pela IA principal (ex: Gemini ou OpenAI)
        """
        return "Este provedor só gera embeddings locais."
