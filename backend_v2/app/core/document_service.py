from app.utils.pdf_utils import extract_text_from_pdf
from app.core.vectorstore import VectorStore
from datetime import datetime
import tiktoken
from openai import OpenAI

vector_store = VectorStore()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def chunk_text(text: str, max_tokens: int = 500):
    # Simples chunk por tokens aproximados
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

def ingest_pdf(file_bytes: bytes, filename: str):
    text = extract_text_from_pdf(file_bytes)
    chunks = chunk_text(text)
    for i, chunk in enumerate(chunks, start=1):
        embedding = client.embeddings.create(
            model="text-embedding-3-small",
            input=chunk
        ).data[0].embedding
        metadata = {
            "file_name": filename,
            "chunk_index": i,
            "timestamp": datetime.utcnow().isoformat()
        }
        vector_store.add(chunk, metadata, embedding)
    return {"message": f"Documento '{filename}' processado com sucesso.", "chunks_count": len(chunks)}
