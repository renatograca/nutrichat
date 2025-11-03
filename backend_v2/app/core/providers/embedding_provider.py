import os
from openai import OpenAI
import google.generativeai as genai


class EmbeddingProvider:
    """Interface genérica para diferentes provedores de embeddings"""

    def __init__(self, provider: str = "openai"):
        self.provider = provider.lower()

        if self.provider == "openai":
            self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        elif self.provider == "google":
            genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        else:
            raise ValueError(f"Provedor '{provider}' não é suportado.")

    def embed_text(self, text: str) -> list[float]:
        """Gera embeddings com base no provedor configurado"""

        if self.provider == "openai":
            response = self.client.embeddings.create(
                model="text-embedding-3-small", input=text
            )
            return response.data[0].embedding

        elif self.provider == "google":
            model = genai.GenerativeModel("text-embedding-004")
            response = model.embed_content(text)
            return response["embedding"]

        else:
            raise ValueError(f"Provedor '{self.provider}' não implementado.")
