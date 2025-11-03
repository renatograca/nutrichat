from openai import OpenAI
from app.core.vectorstore import VectorStore

vector_store = VectorStore()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def ask_question(question: str, top_k: int = 5):
    # 1. Obter embedding da pergunta
    query_embedding = client.embeddings.create(
        model="text-embedding-3-small",
        input=question
    ).data[0].embedding

    # 2. Busca no vector store
    docs = vector_store.similarity_search(query_embedding, top_k=top_k)
    context = "\n".join([d[0] for d in docs])

    # 3. Montar prompt
    prompt = f"""
Você é um assistente de nutrição amigável e informativo.
Responda usando apenas o contexto abaixo.
Se não souber, diga "Não tenho informações sobre isso no meu banco de dados nutricional".

Contexto:
{context}

Pergunta:
{question}
"""
    # 4. Chamada ao LLM
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content
