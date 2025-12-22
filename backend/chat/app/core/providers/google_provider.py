import os
import google.generativeai as genai
from app.core.providers.base_provider import BaseAIProvider


class GoogleProvider(BaseAIProvider):
    def __init__(self):
        # Configura a API Key do Gemini
        genai.configure(api_key="AIzaSyAeGuXWC0THG2rAAGcJePv3W_cqLW90iqA")
        # Modelo principal de chat
        self.chat_model = genai.GenerativeModel("gemini-2.5-flash-lite")

    def embed_text(self, text: str) -> list[float]:
        """Gera embedding usando o modelo de embeddings do Gemini."""
        result = genai.embed_content(
            model="models/embedding-001",
            content=text,
        )
        return result["embedding"]

    def ask_question(self, question: str, context: str) -> str:
        """Gera resposta usando o modelo Gemini."""
        prompt = f"""
        Você é um assistente de nutrição amigável e informativo.
        Responda usando apenas o contexto abaixo.
        Se não souber, diga "Não tenho informações sobre isso no meu banco de dados nutricional".

        CONTEXTO:
        {context}

        PERGUNTA:
        {question}
        """
        return self.chat(prompt)

    def chat(self, prompt: str) -> str:
        """Envia um prompt genérico ao Gemini."""
        response = self.chat_model.generate_content(prompt)
        return response.text
