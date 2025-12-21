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

# import os
# from openai import OpenAI
# import tiktoken
# from app.core.providers.base_provider import BaseAIProvider

# class OpenAIProvider(BaseAIProvider):
#     def __init__(self):
#         self.client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

#     def embed_text(self, text: str) -> list[float]:
#         response = self.client.embeddings.create(
#             model="text-embedding-3-small",
#             input=text
#         )
#         return response.data[0].embedding

#     def ask_question(self, question: str, context: str) -> str:
#         prompt = f"""
#         Você é um assistente de nutrição amigável e informativo.
#         Responda usando apenas o contexto abaixo.
#         Se não souber, diga "Não tenho informações sobre isso no meu banco de dados nutricional".

#         Contexto:
#         {context}

#         Pergunta:
#         {question}
#         """
#         response = self.client.chat.completions.create(
#             model="gpt-4o-mini",
#             messages=[{"role": "user", "content": prompt}],
#             max_tokens=200,  # economiza tokens
#             temperature=0.5
#         )
#         return response.choices[0].message.content
