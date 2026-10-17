# NutriChat

Aplicação full-stack (backend Node.js/Express + frontend React/Vite) com PostgreSQL.

## Pré-requisitos

- Node.js >= 18 (use `nvm use` com o `.nvmrc`)
- Docker (para o PostgreSQL) ou PostgreSQL local
- npm

## 1. Banco de dados (PostgreSQL)

```bash
cp .env.docker .env
docker compose -f docker-compose.db.yml up -d
```

Isso cria o container `nutrigpt-postgres` com os scripts de init em `backend/db/init`.

## 2. Backend

```bash
cd backend/chat
cp .env.example .env   # configure variáveis (DB, API keys)
npm install
npm run dev            # desenvolvimento (tsx)
# ou
npm run build && npm start   # produção
```

Variáveis de ambiente esperadas: conexão PostgreSQL (`POSTGRES_HOST`, `POSTGRES_PORT`, `POSTGRES_USER`, `POSTGRES_PASSWORD`) e chave da API Gemini (`GEMINI_API_KEY`).

## 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Acessível em `http://localhost:5173` (padrão Vite).

## Estrutura

- `backend/chat` — API Express/TypeScript
- `backend/db/init` — scripts SQL de inicialização
- `frontend` — React + Vite
- `.nvmrc` — versão do Node

## Scripts úteis

- Frontend: `npm run build`, `npm run start` (preview)
- Backend: `npm run build`, `npm start`, `npm run dev`
