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
from app.core.chat_repository import ChatRepository
from typing import List

vector_store = VectorStore()
ai_provider = get_ai_provider()
embegging_provider = get_embedding_provider()
chat_repo = ChatRepository()


def ask_question(question: str, user_id: str, chat_id: str = None, top_k: int = 5):
    # 1. Obter embedding da pergunta
    query_embedding = embegging_provider.embed_text(question)

    # 2. Buscar contexto no vector store filtrando por user_id e chat_id
    docs = vector_store.similarity_search(query_embedding, user_id, chat_id=chat_id, top_k=top_k)
    context = "\n".join([d[0] for d in docs])

    # 3. Obter histórico recente se chat_id for fornecido
    history_str = ""
    if chat_id:
        messages = chat_repo.get_chat_messages(chat_id, limit=10)
        # Format history: "Role: Content"
        history_str = "\n".join([f"{m['role']}: {m['content']}" for m in messages])

    # 4. Construir prompt com histórico e contexto
    full_prompt = f"""
Você é um assistente de nutrição amigável e informativo.
Responda exclusivamente com base no contexto do documento fornecido abaixo.
Se a resposta não existir no plano nutricional, informe que não possui essa informação.

Histórico da conversa:
{history_str}

Contexto do Documento:
{context}

Pergunta:
{question}
"""

    # 5. Fazer pergunta ao modelo
    response = ai_provider.chat(full_prompt)
    
    return response
