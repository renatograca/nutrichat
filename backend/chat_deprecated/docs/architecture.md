# Arquitetura e arquivos chave

Breve mapa dos componentes do backend:

- `app/main.py` — Cria a aplicação FastAPI e registra routers (`/api/chat`, `/api/documents`).
- `app/api/endpoints/chat.py` — Endpoints relacionados ao fluxo de chat e ingestão.
- `app/api/endpoints/documents.py` — Endpoints para gerenciar documentos.
- `app/core/vectorstore.py` — Lógica de armazenamento de embeddings (Postgres + pgvector).
- `app/core/document_service.py` — Processamento e extração de conteúdo de documentos (PDFs).
- `app/core/chat_service.py` — Orquestra prompts, chamadas ao provedor de IA e montagens de resposta.
- `app/core/ai_provider.py` — Abstração sobre provedores de embedding/LLM (OpenAI, Google, local, etc.).

### Banco de dados

O projeto usa PostgreSQL com a extensão `pgvector` para armazenar embeddings vetoriais.

### Ingestão de documentos

1. Upload do arquivo via `/api/chat/ingest`.
2. Extração do conteúdo (PDF parsing) em `document_service`.
3. Geração de embedding (provedor configurável em `app/providers`).
4. Armazenamento no Postgres em `documents` com coluna `embedding VECTOR(...)`.
