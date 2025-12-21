# Endpoints principais

Esta seção descreve os endpoints expostos pela API conforme a estrutura do projeto.

## `/api/chat`

- POST `/api/chat/ingest` — Envia um PDF para ingestão e indexação.
- GET `/api/chat/pergunta` — Faz uma pergunta via RAG. Exemplo: `/api/chat/pergunta?message=Qual%20a%20diferen%C3%A7a%20entre%20prote%C3%ADnas`.

## `/api/documents`

- Endpoints de gerenciamento de documentos (upload, listagem, remoção).

## Health

- GET `/health` — Retorna `{ "status": "ok" }`.

---

Observação: Para detalhes mais precisos dos parâmetros e exemplos, consulte os arquivos em `app/api/endpoints/`.
