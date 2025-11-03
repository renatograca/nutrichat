from fastapi import FastAPI
from app.api.endpoints import chat, documents

app = FastAPI(title="NutriChat API")

app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
