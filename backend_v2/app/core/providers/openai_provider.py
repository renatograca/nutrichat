# from openai import OpenAI
# import os
# from app.core.ai_provider import AIProvider

# class OpenAIProvider(AIProvider):
#     def __init__(self):
#         self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

#     def get_embedding(self, text: str) -> list[float]:
#         response = self.client.embeddings.create(
#             model="text-embedding-3-small",
#             input=text
#         )
#         return response.data[0].embedding

#     def chat(self, prompt: str) -> str:
#         response = self.client.chat.completions.create(
#             model="gpt-4o-mini",
#             messages=[{"role": "user", "content": prompt}]
#         )
#         return response.choices[0].message.content
