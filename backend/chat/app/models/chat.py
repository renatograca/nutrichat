from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from uuid import UUID

class ChatCreate(BaseModel):
    user_id: str
    title: Optional[str] = None

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
    document_id: Optional[str] = None
    title: Optional[str] = None
    created_at: datetime
    updated_at: datetime

class ChatListResponse(BaseModel):
    chats: List[ChatResponse]

class MessageListResponse(BaseModel):
    messages: List[ChatMessageResponse]
