import os
import google.generativeai as genai
from app.core.ai_provider import AIProvider


class GoogleProvider(AIProvider):
    def __init__(self):
        genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def get_embedding(self, text: str) -> list[float]:
        # Gemini usa a API de embeddings separada
        embedding = genai.embed_content(model="models/embedding-001", content=text)
        return embedding["embedding"]

    def chat(self, prompt: str) -> str:
        response = self.model.generate_content(
            prompt, generation_config={"temperature": 0.2, "max_output_tokens": 300}
        )
        return response.text
