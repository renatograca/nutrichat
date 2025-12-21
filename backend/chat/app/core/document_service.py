from app.utils.pdf_utils import extract_text_from_pdf
from app.core.vectorstore import VectorStore
from datetime import datetime
import tiktoken
import os
from app.core.providers.provider_factory import get_embedding_provider

ai_provider = get_embedding_provider()


def chunk_text(text: str, max_tokens: int = 500):
    """Divide texto em partes menores com base na contagem aproximada de tokens"""
    chunks = []
    current = []
    tokens_count = 0
    encoder = tiktoken.get_encoding("cl100k_base")

    for line in text.split("\n"):
        line_tokens = len(encoder.encode(line))
        if tokens_count + line_tokens > max_tokens:
            chunks.append("\n".join(current))
            current = []
            tokens_count = 0
        current.append(line)
        tokens_count += line_tokens

    if current:
        chunks.append("\n".join(current))
    return chunks


def ingest_pdf(file_bytes: bytes, filename: str, user_id: str):
    """Extrai texto de PDF, gera embeddings e salva no vetor store"""

    # 1️⃣ Lê o PDF e divide em chunks
    text = extract_text_from_pdf(file_bytes)
    chunks = chunk_text(text)

    # 2️⃣ Define provedor via variável de ambiente
    provider_name = os.getenv("EMBEDDING_PROVIDER", "google")
    vector_store = VectorStore()

    # 3️⃣ Gera embeddings e salva
    for i, chunk in enumerate(chunks, start=1):
        embedding = ai_provider.embed_text(chunk)
        metadata = {
            "file_name": filename,
            "chunk_index": i,
            "timestamp": datetime.utcnow().isoformat(),
            "user_id": user_id
        }
        vector_store.add(chunk, metadata, embedding)

    return {
        "message": f"Documento '{filename}' processado com sucesso usando {provider_name.title()}.",
        "chunks_count": len(chunks),
        "user_id": user_id
    }
