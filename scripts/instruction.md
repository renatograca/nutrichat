# PROMPT – Migração Backend NutriChat (FastAPI → Node.js)

## Contexto
O projeto **NutriChat** possui um backend totalmente funcional em **Python + FastAPI**, responsável por:
- Autenticação
- Gestão de usuários
- Chats persistidos
- Upload de documentos
- Integração com RAG
- Persistência de mensagens
- Integração com PostgreSQL
- Lógica de negócio consolidada

O objetivo NÃO é refatorar, melhorar ou alterar a lógica existente.

---

## Objetivo Principal
Migrar **100% do código backend** de **Python (FastAPI)** para **Node.js**, utilizando:
- **Express.js** (ou lib equivalente madura)
- Padrões equivalentes aos usados no FastAPI

⚠️ A migração deve ser **estritamente técnica**, sem mudanças funcionais.

---

## Regras OBRIGATÓRIAS

🚨 **NÃO alterar absolutamente nada além da linguagem**:
- NÃO mudar regras de negócio
- NÃO mudar fluxos
- NÃO mudar nomes de endpoints
- NÃO mudar contratos de API
- NÃO mudar payloads
- NÃO mudar estrutura de responses
- NÃO mudar validações
- NÃO mudar lógica de erros
- NÃO mudar banco de dados
- NÃO mudar queries SQL
- NÃO mudar comportamento de edge cases

---

## Tecnologias Permitidas

### Framework
- **Express.js** (preferencial)
- Alternativa aceita: Fastify (somente se houver justificativa)

### Banco de Dados
- PostgreSQL
- Driver: `pg`

### Upload de Arquivos
- `multer`

### Validação
- `zod` (equivalente ao Pydantic)

### Configuração
- `dotenv`

---

## Mapeamento de Conceitos (Obrigatório)

| FastAPI | Node.js |
|------|--------|
| FastAPI app | Express app |
| APIRouter | Express Router |
| Pydantic | Zod |
| Depends | Middlewares |
| HTTPException | Custom Error Handler |
| BackgroundTasks | Async jobs |
| Lifespan | App bootstrap |

---

## Estrutura Esperada do Projeto

```txt
src/
├── app.js
├── server.js
├── routes/
├── controllers/
├── services/
├── repositories/
├── middlewares/
├── db/
├── config/
└── utils/
A estrutura deve refletir a organização atual do projeto FastAPI.

Banco de Dados
Todas as queries SQL devem ser copiadas exatamente como estão

Nenhuma coluna, tabela ou relacionamento pode ser alterado

Apenas adaptar a execução para pg

Tratamento de Erros
Mapear todos os HTTPException para:

res.status(code).json({ ... })

Mensagens devem ser idênticas

Autenticação
Copiar lógica existente

Manter headers, tokens, claims e validações

Upload de Documentos
Comportamento deve ser idêntico

Mesmos formatos aceitos

Mesmo fluxo de persistência

Mesmo tratamento de erro

RAG / IA
NÃO alterar lógica

NÃO alterar prompts

NÃO alterar pipeline

Apenas trocar SDKs se necessário

Testes
Se existirem testes em Python:

Criar equivalentes em Node

Se não existirem:

NÃO criar novos testes

Critérios de Aceite
 Todos os endpoints existentes funcionam igual

 Responses idênticas

 Status HTTP idênticos

 Banco de dados inalterado

 Migração 100% fiel

 Diferença apenas na linguagem

O que NÃO fazer
NÃO refatorar

NÃO otimizar

NÃO reorganizar lógica

NÃO mudar naming

NÃO remover código morto

NÃO "melhorar" nada

Observação Final
Este é um rewrite técnico, não um redesign.
Qualquer dúvida deve ser resolvida replicando exatamente o comportamento atual.