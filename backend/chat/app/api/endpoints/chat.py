from fastapi import APIRouter, Body, HTTPException, Query
from app.core.chat_service import ask_question
from app.core.chat_repository import ChatRepository
from app.models.chat import (
    ChatCreate, ChatResponse, ChatListResponse, 
    ChatMessageCreate, ChatMessageResponse, MessageListResponse
)
from typing import List

router = APIRouter()
chat_repo = ChatRepository()

@router.post("", response_model=ChatResponse)
def create_chat(chat_data: ChatCreate):
    # Por simplicidade, o título será o document_id ou algo genérico
    title = f"Chat sobre {chat_data.documentId[:8]}"
    chat_id = chat_repo.create_chat(chat_data.user_id, chat_data.documentId, title)
    chat = chat_repo.get_chat(chat_id)
    return chat

@router.get("", response_model=List[ChatResponse])
def list_chats(user_id: str = Query(...)):
    chats = chat_repo.get_user_chats(user_id)
    return chats

@router.get("/{chatId}/messages", response_model=List[ChatMessageResponse])
def get_messages(chatId: str, user_id: str = Query(...)):
    chat = chat_repo.get_chat(chatId)
    if not chat or chat['user_id'] != user_id:
        raise HTTPException(status_code=404, detail="Chat não encontrado")
    
    messages = chat_repo.get_chat_messages(chatId)
    return messages

@router.post("/{chatId}/messages")
def send_message(chatId: str, msg_data: ChatMessageCreate):
    chat = chat_repo.get_chat(chatId)
    if not chat or chat['user_id'] != msg_data.user_id:
        raise HTTPException(status_code=404, detail="Chat não encontrado")
    
    # 1. Salvar mensagem do usuário
    chat_repo.add_message(chatId, "USER", msg_data.message)
    
    # 2. Obter resposta do RAG
    resposta = ask_question(msg_data.message, msg_data.user_id, chat_id=chatId)
    
    # 3. Salvar mensagem do assistente
    chat_repo.add_message(chatId, "ASSISTANT", resposta)
    
    return {"pergunta": msg_data.message, "text": resposta, "user_id": msg_data.user_id}

@router.delete("/{chatId}")
def delete_chat(chatId: str, user_id: str = Query(...)):
    chat = chat_repo.get_chat(chatId)
    if not chat or chat['user_id'] != user_id:
        raise HTTPException(status_code=404, detail="Chat não encontrado")
    
    chat_repo.delete_chat(chatId)
    return {"message": "Chat deletado com sucesso"}
