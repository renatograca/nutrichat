# PROMPT – Ajustes de UI/UX no Frontend (NutriChat)

## Contexto
O frontend do **NutriChat** é:
- Um app WebView (mobile-first)
- Desenvolvido em React
- Possui múltiplos chats com histórico persistido
- Possui upload de documento e chat com IA

Recentemente o design da tela de chat foi alterado, porém precisamos **retornar ao design anterior**, que é:
- Mais simples
- Mais limpo
- Mais focado em conversa

---

## Objetivo
Ajustar o frontend para:
1. Restaurar o **design anterior da tela de chat**
2. Exibir um **botão de inserir documento** ao iniciar um chat
3. Mover a **lista de chats** para um **menu no header**

---

## Requisitos Funcionais

### 1️⃣ Tela de Chat (ChatView)

#### Design
- Voltar para o layout anterior da tela de chat
- Interface limpa
- Mensagens em formato de balão
- Área de input fixa na parte inferior
- Sem distrações visuais

#### Comportamento Inicial
- Ao abrir um chat:
  - Se o chat **não tiver documento associado**:
    - Exibir botão claro: **“Inserir plano alimentar”**
    - Botão deve ficar visível na área principal do chat (estado vazio)
- Enquanto não houver documento:
  - Input de mensagem deve ficar desabilitado
  - Exibir texto explicativo simples

---

### 2️⃣ Upload de Documento no Chat

- Botão de upload deve:
  - Abrir seletor de arquivo
  - Associar documento ao chat existente
- Após upload:
  - Remover estado vazio
  - Habilitar campo de mensagem
  - Manter usuário na mesma tela

---

### 3️⃣ Header com Menu de Chats

#### Header
- Header fixo no topo
- Exibir:
  - Logo ou nome “NutriChat”
  - Ícone de menu (☰ ou similar)

#### Menu de Chats
- Ao clicar no menu:
  - Abrir lista de chats do usuário
  - Lista pode ser:
    - Drawer lateral
    - Dropdown full-width
- A lista deve permitir:
  - Abrir chat existente
  - Criar novo chat
  - Apagar chat

---

## Estrutura de Componentes (Sugestão)

```txt
components/
├── Header.jsx
├── ChatMenu.jsx
├── ChatView.jsx
├── UploadDocumentButton.jsx
└── MessageBubble.jsx
Regras de UX (Obrigatórias)
Mobile-first

Touch-friendly

Poucos cliques

Feedback visual claro

Estados vazios bem definidos

Evitar modais desnecessários

Estados de UI Importantes
Chat sem documento

Upload em andamento

Chat ativo

Lista de chats vazia

Erro de upload

Restrições
NÃO alterar a lógica de backend

NÃO alterar contratos de API

NÃO adicionar bibliotecas pesadas

NÃO criar fluxos complexos

Critérios de Aceite
 Tela de chat voltou ao design anterior

 Botão “Inserir documento” aparece ao iniciar chat

 Input bloqueado sem documento

 Menu de chats acessível pelo header

 Navegação fluida em WebView

 UX simples e intuitiva

Observações Finais
Priorizar simplicidade

Manter código limpo

Preparar UI para futuras evoluções

O app deve parecer nativo dentro da WebView

FIM DO PROMPT