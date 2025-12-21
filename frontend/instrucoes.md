# 📱🥗 NutriChat – Projeto WebView
Seu Assistente Inteligente de Plano Alimentar

---

## 🧠 PROMPT PRINCIPAL – NutriChat WebView

### Contexto do Projeto
Crie um aplicativo chamado **NutriChat**, que será executado **exclusivamente dentro de uma WebView** (Android e iOS).

O aplicativo permite que o usuário:
- Faça upload de um **plano nutricional** (PDF, DOCX ou TXT)
- Interaja com um **assistente de IA** que responde **somente com base no documento enviado** (arquitetura RAG)

⚠️ O app **não precisa de funcionalidades nativas avançadas**, pois todo o comportamento acontece via frontend web e backend em nuvem.

---

### 🎯 Objetivo
Criar uma aplicação:
- Simples
- Leve
- Fácil de manter
- Otimizada para WebView
- Com visual saudável, confiável e inteligente
- Fácil de subir em nuvem

---

## 🧱 Tecnologias Recomendadas (WebView-Friendly)

### Frontend
- **Framework:** React + Vite
- **Linguagem:** JavaScript (evitar TypeScript para simplicidade)
- **Estilo:** CSS puro ou CSS Modules
- **Arquitetura:** SPA simples
- **Mobile-first**
- **Sem SSR**
- **PWA**

## ☁️ Infraestrutura & Deploy
- Build estático (`npm run build`)
- Servir arquivos via:
  - Nginx
  - Vercel
  - AWS S3 + CloudFront
- Fácil manutenção e baixo custo operacional

---

## 🎨 Estilo Visual – Identidade NutriChat

O design deve transmitir:
- 🥗 Saúde
- 🧠 Inteligência
- 🤝 Confiança
- ✨ Simplicidade

### Diretrizes Visuais
- Paleta clara (verde, branco, tons naturais)
- Tipografia legível
- Espaçamento confortável
- Ícones simples
- Interface limpa
- Pensado para toque (touch-friendly)
- Sem excesso de animações

---

## 🚫 O que EVITAR
- Frameworks pesados de UI
- Micro-frontends
- Lógicas complexas no frontend
- Dependência excessiva de estado global
- Animações pesadas
- Bibliotecas desnecessárias

---

## ✅ RESULTADO ESPERADO
- App WebView leve
- Código limpo e organizado
- Fácil de escalar
- Fácil de manter
- UX simples e eficiente
- Visual profissional e moderno

---

# 🧩 CHECKLIST TÉCNICO – NutriChat WebView

## Frontend
- [ ] React + Vite configurado
- [ ] SPA simples
- [ ] Layout mobile-first
- [ ] CSS leve e otimizado
- [ ] Upload de arquivos no chat
- [ ] Chat responsivo
- [ ] Tratamento de loading e erro
- [ ] Compatível com WebView Android/iOS

## Performance
- [ ] Bundle pequeno
- [ ] Sem dependências pesadas
- [ ] Imagens otimizadas
- [ ] Fontes leves
---

# 🧱 TEMPLATE INICIAL – Estrutura do Projeto

```txt
nutrichat-webview/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Chat.jsx
│   │   └── Upload.jsx
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   └── main.css
│   ├── App.jsx
│   └── main.jsx
├── .env
├── package.json
└── vite.config.js
