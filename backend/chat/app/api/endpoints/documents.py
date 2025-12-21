from fastapi import APIRouter, UploadFile, File, Form
from app.core.document_service import ingest_pdf
from app.models.document import DocumentIngestResponse
from typing import Optional

router = APIRouter()


@router.post("", response_model=DocumentIngestResponse)
async def ingest_document(
    file: UploadFile = File(...),
    user_id: str = Form(...)
):
    if not file.filename.lower().endswith(".pdf"):
        return {"message": "Por favor, envie um PDF válido.", "chunks_count": 0, "user_id": user_id}
    content = await file.read()
    result = ingest_pdf(content, file.filename, user_id)
    return result
