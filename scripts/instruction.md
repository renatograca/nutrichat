# PROMPT – Gerar Script de Reset e Criação do Banco de Dados (NutriChat)

## Contexto
Você está trabalhando no backend do **NutriChat**.

O projeto já possui:
- Banco de dados existente (nome pode variar)
- Tabelas existentes com nomes próprios do projeto
- Modelagem atual de usuários, documentos, chats e mensagens
- Relacionamentos já definidos por `user_id`

Os nomes do **database**, **schemas** e **tabelas** **NÃO são padronizados** e **devem ser respeitados** conforme o projeto atual.

---

## Objetivo
Criar um **script SQL de RESET COMPLETO**, que:
1. Apague todos os dados existentes
2. Recrie o banco (ou schema) do zero
3. Recrie todas as tabelas com a modelagem correta
4. Use **exatamente os nomes atuais** de:
   - Banco de dados
   - Schema (se houver)
   - Tabelas
   - Colunas
   - Constraints

---

## Instruções Obrigatórias

### 1️⃣ Antes de gerar o script
- Analise a modelagem atual do projeto
- Identifique:
  - Nome do banco de dados
  - Nome do schema (se existir)
  - Nome real das tabelas
  - Nome real das colunas
- NÃO assumir nomes genéricos
- NÃO inventar nomes novos

---

### 2️⃣ O script DEVE

- Dropar tabelas na ordem correta (respeitando FKs)
- Permitir reset completo do ambiente
- Recriar:
  - Tabela de usuários
  - Tabela de documentos
  - Tabela de chats
  - Tabela de mensagens
- Manter relacionamento por `user_id`
- Permitir:
  - `chat.title` ser NULL
  - `chat.document_id` ser NULL
- Garantir integridade referencial
- Criar índices importantes
- Criar triggers (se já existirem no projeto)

---

## Modelagem Lógica Esperada (independente de nomes)

### Usuário
- Identificador único
- Relacionamento 1:N com documentos
- Relacionamento 1:N com chats

### Documento
- Pertence a um usuário
- Pode ser associado posteriormente a um chat

### Chat
- Pertence a um usuário
- Pode existir sem documento
- Pode existir sem título
- Pode ter várias mensagens

### Mensagem
- Pertence a um chat
- Possui papel (USER / ASSISTANT / SYSTEM)

---

## Regras Importantes

- O script deve ser:
  - Seguro para ambiente de desenvolvimento
  - Executável de ponta a ponta
- Não usar nomes hardcoded diferentes dos existentes
- Não alterar semântica do modelo atual
- Priorizar clareza e organização
- Comentar o script quando necessário

---

## Resultado Esperado

- Um único script SQL
- Que zere completamente o banco
- Recrie a estrutura atualizada
- Esteja alinhado com:
  - Chats sem `title` inicial
  - Chats sem `document_id` inicial
  - Associação posterior de documentos
- Pronto para execução manual ou via migration tool

---

## Observações Finais
- Este script será usado em ambiente de desenvolvimento
- A clareza é mais importante que otimização extrema
- O backend é a fonte da verdade

FIM DO PROMPT
