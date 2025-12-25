from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.core.document_service import ingest_pdf
from app.models.document import DocumentIngestResponse
from typing import Optional
from app.core.chat_repository import ChatRepository

router = APIRouter()
chat_repo = ChatRepository()


@router.post("", response_model=DocumentIngestResponse)
async def ingest_document(
    file: UploadFile = File(...),
    user_id: str = Form(...),
    chat_id: Optional[str] = Form(None)
):
    if not file.filename.lower().endswith(".pdf"):
        return {"message": "Por favor, envie um PDF válido.", "chunks_count": 0, "user_id": user_id, "document_id": None}
    content = await file.read()
    result = ingest_pdf(content, file.filename, user_id, chat_id)

    document_id = result.get("document_id")

    # Se foi passado chat_id, associar o documento ao chat (validações em repo/endpoint)
    if chat_id:
        chat = chat_repo.get_chat(chat_id)
        if not chat or chat.get('user_id') != user_id:
            raise HTTPException(status_code=404, detail="Chat não encontrado ou não pertence ao usuário")
        # Associação
        chat_repo.update_chat_document(chat_id, document_id)

    return result
