# NutriChat Backend v2 - Node.js Migration

Migração completa do backend FastAPI para Node.js + Express com funcionalidades idênticas.

## Estrutura do Projeto

```
src/
├── app.js                 # Configuração Express
├── server.js              # Entry point
├── config/
│   └── config.js         # Variáveis de ambiente
├── db/
│   └── pool.js           # Pool de conexão PostgreSQL
├── repositories/
│   ├── ChatRepository.js
│   └── DocumentRepository.js
├── services/
│   ├── ChatService.js
│   └── DocumentService.js
├── routes/
│   ├── chatRoutes.js
│   └── documentRoutes.js
├── core/
│   ├── VectorStore.js
│   ├── schemas.js
│   └── providers/
│       ├── BaseAIProvider.js
│       ├── GoogleProvider.js
│       └── providerFactory.js
├── middlewares/
│   └── logMiddleware.js
└── utils/
    ├── logger.js
    └── pdfUtils.js
```

## Configuração

### Variáveis de Ambiente

```env
NODE_ENV=local
PORT=8080
DATABASE_URL=postgresql://user:password@host:port/db
GOOGLE_API_KEY=seu_api_key
AI_PROVIDER=google
EMBEDDING_PROVIDER=google
```

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

## Produção

```bash
npm start
```

## Docker

```bash
docker-compose up -d
```

## Endpoints

### Chats
- `POST /api/chats` - Criar novo chat
- `GET /api/chats` - Listar chats do usuário
- `GET /api/chats/{chatId}` - Obter chat específico
- `PATCH /api/chats/{chatId}` - Atualizar título do chat
- `DELETE /api/chats/{chatId}` - Deletar chat
- `POST /api/chats/{chatId}/document` - Associar documento ao chat
- `GET /api/chats/{chatId}/messages` - Obter mensagens do chat
- `POST /api/chats/{chatId}/messages` - Enviar mensagem

### Documentos
- `POST /api/documents` - Fazer upload de PDF

## Observações de Migração

- Todas as queries SQL foram adaptadas de `psycopg2` para `pg`
- Zod substitui Pydantic para validação
- Google Generative AI SDK substitui a integração anterior
- pdfjs-dist substitui PyPDF2 para extração de texto
- Estrutura de diretórios reflete a organização do FastAPI

## Status

✅ Estrutura completa
✅ Repositórios (Chat e Document)
✅ Serviços (Chat e Document)
✅ Rotas (Chat e Document)
✅ VectorStore
✅ Providers de IA
✅ Middleware de logging
✅ Docker setup
