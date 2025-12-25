# PROMPT – Ajustar Relacionamento Chat ↔ Documento (NutriChat)

## Contexto
O projeto **NutriChat** possui:
- Usuários (`user_id`)
- Chats persistidos
- Upload de documentos (plano alimentar)
- Arquitetura RAG baseada no documento enviado

Atualmente:
- Chats são criados SEM título
- Chats são criados SEM documento
- Documento é enviado APÓS a criação do chat
- Não existe relacionamento persistido entre chat e documento no banco

Isso causa perda de contexto e dificulta a retomada do chat.

---

## Objetivo
Ajustar a **modelagem de dados**, **persistência** e **fluxo backend** para que:

- Um chat possa existir sem documento inicialmente
- Um documento possa ser associado posteriormente a um chat
- Todas as mensagens e consultas RAG usem o documento associado ao chat
- O relacionamento seja simples, explícito e persistido

---

## Regra de Negócio (Obrigatória)

- Um **chat pertence a um usuário**
- Um **documento pertence a um usuário**
- Um **chat pode ter ZERO ou UM documento**
- Um documento é associado ao chat APÓS o upload
- Um chat NÃO pode usar documento de outro usuário

---

## Alterações no Banco de Dados

### 1️⃣ Atualizar tabela `chats`

Adicionar coluna nullable `document_id`:

```sql
ALTER TABLE chats
ADD COLUMN document_id uuid REFERENCES documents(id);
A coluna deve permitir NULL

A FK deve apontar para documents(id)

Não usar CASCADE DELETE

Criar índice:

sql
Copiar código
CREATE INDEX idx_chats_document_id ON chats(document_id);
Fluxo Backend Esperado
1️⃣ Criação do Chat
Endpoint cria o chat com:

user_id

title = NULL

document_id = NULL

sql
Copiar código
INSERT INTO chats (user_id)
VALUES (:userId);
2️⃣ Upload do Documento
Documento é salvo normalmente

Documento pertence ao usuário (user_id)

Retornar document_id

3️⃣ Associação Documento ↔ Chat
Após upload bem-sucedido:

sql
Copiar código
UPDATE chats
SET document_id = :documentId
WHERE id = :chatId
AND user_id = :userId;
Validar que o chat pertence ao usuário

Validar que o documento pertence ao mesmo usuário

Ajustes no RAG / Vector Store
Persistência dos Embeddings
Ao salvar embeddings, garantir que o metadata contenha:

json
Copiar código
{
  "user_id": 123,
  "chat_id": "uuid-do-chat",
  "document_id": "uuid-do-documento"
}
Recuperação Semântica (Obrigatório)
Todas as buscas no vector store DEVEM:

Filtrar por document_id

Opcionalmente validar user_id

Exemplo lógico:

sql
Copiar código
SELECT *
FROM vector_store
WHERE metadata->>'document_id' = :documentId;
Ajustes na API
Chat Endpoint
Ao receber mensagem:

Buscar o chat

Verificar se document_id existe

Se não existir, retornar erro de negócio:

"Chat não possui documento associado"

Validações Obrigatórias
❌ Não permitir associar documento de outro usuário

❌ Não permitir chat usar documento inexistente

❌ Não permitir RAG sem documento

✅ Chat pode existir sem documento

✅ Documento pode existir sem chat (até ser associado)

O que NÃO fazer
NÃO criar tabela N:N neste momento

NÃO permitir múltiplos documentos por chat

NÃO misturar contexto de chats diferentes

NÃO salvar relacionamento apenas em memória

Critérios de Aceite
 Chat inicia sem documento

 Documento pode ser associado depois

 Associação persistida no banco

 RAG usa exclusivamente o documento do chat

 Retomar chat funciona corretamente

 Modelo simples e manutenível

Observação Final
Este modelo foi escolhido para:

Simplicidade

Clareza

Facilidade de manutenção

Compatibilidade com RAG

Escalabilidade futura

FIM DO PROMPT