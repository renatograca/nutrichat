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
def create_chat(chat_data: ChatCreate = Body(None)):
    user_id = chat_data.user_id if chat_data else "default_user" # Fallback temporário
    title = chat_data.title if chat_data else None
    chat_id = chat_repo.create_chat(user_id, title=title)
    chat = chat_repo.get_chat(chat_id)
    return chat

@router.post("/{chatId}/document")
def associate_document(chatId: str, body: dict = Body(...)):
    document_id = body.get("documentId")
    user_id = body.get("user_id") # Idealmente viria do token
    
    if not document_id:
        raise HTTPException(status_code=400, detail="documentId é obrigatório")
    
    chat = chat_repo.get_chat(chatId)
    if not chat or chat['user_id'] != user_id:
        raise HTTPException(status_code=404, detail="Chat não encontrado")
    
    # TODO: Validar se o documento pertence ao usuário se houver uma tabela de documentos
    
    chat_repo.update_chat_document(chatId, document_id)
    return {"message": "Documento associado com sucesso"}

@router.patch("/{chatId}")
def update_chat(chatId: str, body: dict = Body(...)):
    title = body.get("title")
    user_id = body.get("user_id") # Idealmente viria do token
    
    chat = chat_repo.get_chat(chatId)
    if not chat or chat['user_id'] != user_id:
        raise HTTPException(status_code=404, detail="Chat não encontrado")
    
    if title:
        chat_repo.update_chat_title(chatId, title)
    
    return {"message": "Chat atualizado com sucesso"}

@router.get("", response_model=List[ChatResponse])
def list_chats(user_id: str = Query(None)):
    try:
        if not user_id:
            raise HTTPException(status_code=404, detail="user_id is empty")
        chats = chat_repo.get_user_chats(user_id)
        return chats
    except Exception:
        return []

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
    
    # Validação RAG: Só processa se houver documento associado
    if not chat.get('document_id'):
        raise HTTPException(
            status_code=400, 
            detail="Este chat não possui um documento associado. Por favor, faça o upload de um plano nutricional primeiro."
        )
    
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
