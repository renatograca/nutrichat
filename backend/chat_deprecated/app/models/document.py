from pydantic import BaseModel
from typing import Optional


class DocumentIngestResponse(BaseModel):
    message: str
    chunks_count: int
    user_id: Optional[str] = None
    document_id: Optional[str] = None


class ChatRequest(BaseModel):
    text: str
    user_id: str


class ChatResponse(BaseModel):
    pergunta: str
    text: str
    user_id: Optional[str] = None
