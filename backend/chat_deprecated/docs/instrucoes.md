# PROMPT – Ajuste de Modelagem e Fluxo de Chat (Backend – NutriChat)

## Contexto
O backend do **NutriChat** já possui:
- Usuários autenticados (`user_id`)
- Documentos nutricionais vinculados a `user_id`
- Persistência de chats e mensagens

Atualmente, o fluxo precisa ser ajustado para permitir que:
- Um chat seja criado **sem título**
- Um chat seja criado **sem documento**
- O documento (`document_id`) seja associado ao chat **somente após o upload**
- O título do chat seja definido **posteriormente**, de forma automática ou manual

---

## Objetivo
Ajustar a **modelagem de dados** e os **fluxos de API** para suportar:
- Criação inicial de chats vazios
- Associação tardia de documento
- Atualização tardia de título
- Manutenção da integridade por `user_id`

---

## Requisitos Funcionais

### Criação de Chat
- Chat deve poder ser criado com:
  - `user_id` (obrigatório)
  - `title` = NULL
  - `document_id` = NULL
- Chat pode existir sem mensagens
- Chat pode existir sem documento

---

### Associação de Documento
- Um documento pode ser associado a um chat **após o upload**
- Um chat pode ter **no máximo um documento**
- Documento deve pertencer ao mesmo `user_id` do chat

---

### Definição de Título
- O título do chat:
  - Não é obrigatório na criação
  - Pode ser atualizado posteriormente
  - Pode ser gerado automaticamente (ex: a partir da primeira mensagem)

---

## Modelagem de Dados (Obrigatória)

### Tabela: chat (ajustada)
```sql
chat
----
id
user_id                NOT NULL
document_id            NULL
title                  NULL
created_at
updated_at
Regras
user_id → FK obrigatória

document_id → FK opcional

title → campo opcional

updated_at deve ser atualizado sempre que:

Mensagem for enviada

Documento for associado

Título for alterado

APIs Necessárias / Ajustadas
1️⃣ Criar Chat Vazio
http
Copiar código
POST /api/chats
Body

json
Copiar código
{}
Ações

Criar chat com:

user_id do token

title = NULL

document_id = NULL

Retornar chatId

2️⃣ Associar Documento ao Chat
http
Copiar código
POST /api/chats/{chatId}/document
Body

json
Copiar código
{
  "documentId": "uuid"
}
Ações

Validar se o chat pertence ao usuário

Validar se o documento pertence ao usuário

Associar document_id ao chat

Atualizar updated_at

3️⃣ Atualizar Título do Chat
http
Copiar código
PATCH /api/chats/{chatId}
Body

json
Copiar código
{
  "title": "Plano da Semana"
}
Ações

Validar propriedade do chat

Atualizar título

Atualizar updated_at

Envio de Mensagens (Ajuste Obrigatório)
Regras
Mensagens só podem ser processadas via RAG se:

document_id estiver associado ao chat

Caso contrário:

Retornar erro controlado ou

Mensagem informativa ao frontend

Validações Obrigatórias
Um usuário não pode:

Associar documento de outro usuário

Enviar mensagens RAG sem documento associado

Um chat pertence sempre a um único usuário

Um documento pertence sempre a um único usuário

Migração de Banco (Obrigatória)
Ajustar colunas:

Permitir NULL em title

Permitir NULL em document_id

Criar FK opcional para document_id

Garantir integridade referencial

Requisitos Não-Funcionais
Código simples

Fácil manutenção

Pronto para cloud

Sem lógica desnecessária

Fluxo claro e previsível

Critérios de Aceite
 Chat pode ser criado sem título

 Chat pode ser criado sem documento

 Documento pode ser associado posteriormente

 Título pode ser definido posteriormente

 Segurança por user_id mantida

 RAG só executa quando documento existe

Observações Finais
Backend é a fonte da verdade

Evitar lógica duplicada no frontend

Priorizar clareza e simplicidade

Preparar base para futuras evoluções

FIM DO PROMPT