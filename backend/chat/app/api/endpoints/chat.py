from fastapi import APIRouter, Body
from app.core.chat_service import ask_question
from app.models.document import ChatResponse, ChatRequest

router = APIRouter()


@router.post("", response_model=ChatResponse)
def chat_pergunta(
    request: ChatRequest
):
    resposta = ask_question(request.text, request.user_id)
    return {"pergunta": request.text, "text": resposta, "user_id": request.user_id}
