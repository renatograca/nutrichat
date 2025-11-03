from fastapi import APIRouter, UploadFile, File
from app.core.document_service import ingest_pdf
from app.models.document import DocumentIngestResponse

router = APIRouter()

@router.post("/ingest", response_model=DocumentIngestResponse)
async def ingest_document(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        return {"message": "Por favor, envie um PDF válido.", "chunks_count": 0}
    content = await file.read()
    result = ingest_pdf(content, file.filename)
    return result
