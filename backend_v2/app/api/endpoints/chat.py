from fastapi import APIRouter, Query
from app.core.chat_service import ask_question
from app.models.document import ChatResponse

router = APIRouter()

@router.get("/pergunta", response_model=ChatResponse)
def chat_pergunta(message: str = Query(..., example="Qual a importância das proteínas?")):
    resposta = ask_question(message)
    return {"pergunta": message, "resposta": resposta}
