from pydantic import BaseModel
from typing import Optional

class DocumentIngestResponse(BaseModel):
    message: str
    chunks_count: int

class ChatResponse(BaseModel):
    pergunta: str
    resposta: str
