from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class ChatCreate(BaseModel):
    documentId: str = Field(..., alias="documentId")
    user_id: str # Normalmente viria do token de auth, mas seguindo o padrão anterior

class ChatMessageCreate(BaseModel):
    message: str
    user_id: str

class ChatMessageResponse(BaseModel):
    id: UUID
    role: str
    content: str
    created_at: datetime

class ChatResponse(BaseModel):
    id: UUID
    user_id: str
    document_id: str
    title: str
    created_at: datetime
    updated_at: datetime

class ChatListResponse(BaseModel):
    chats: List[ChatResponse]

class MessageListResponse(BaseModel):
    messages: List[ChatMessageResponse]
