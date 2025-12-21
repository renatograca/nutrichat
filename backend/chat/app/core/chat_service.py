# import os
# from app.core.vectorstore import VectorStore
#
# # from app.core.providers.openai_provider import OpenAIProvider
# from app.core.providers.google_provider import GoogleProvider
#
# # Escolhe o provedor com base na variável de ambiente
# AI_PROVIDER = os.getenv("AI_PROVIDER", "openai").lower()
#
# # if AI_PROVIDER == "google":
# ai = GoogleProvider()
# # else:
# #     ai = OpenAIProvider()
#
# vector_store = VectorStore()
#
#
# def ask_question(question: str, top_k: int = 5):
#     # 1. Embedding da pergunta
#     query_embedding = ai.ask_question(question)
#
#     # 2. Busca similaridade
#     docs = vector_store.similarity_search(query_embedding, top_k=top_k)
#     context = "\n".join([d[0] for d in docs])
#
#     # 3. Prompt com contexto
#     prompt = f"""
# Você é um assistente de nutrição amigável e informativo.
# Responda usando apenas o contexto abaixo.
# Se não souber, diga "Não tenho informações sobre isso no meu banco de dados nutricional".
#
# Contexto:
# {context}
#
# Pergunta:
# {question}
# """
#
#     # 4. Chamada ao modelo
#     return ai.chat(prompt)


from app.core.vectorstore import VectorStore
from app.core.providers.provider_factory import get_ai_provider
from app.core.providers.provider_factory import get_embedding_provider

vector_store = VectorStore()
ai_provider = get_ai_provider()
embegging_provider = get_embedding_provider()


def ask_question(question: str, user_id: str, top_k: int = 5):
    # 1. Obter embedding da pergunta
    query_embedding = embegging_provider.embed_text(question)

    # 2. Buscar contexto no vector store filtrando por user_id
    docs = vector_store.similarity_search(query_embedding, user_id, top_k=top_k)
    context = "\n".join([d[0] for d in docs])

    # 3. Fazer pergunta ao modelo
    response = ai_provider.ask_question(question, context)
    return response
