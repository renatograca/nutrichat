# NutriChat (WebView-friendly)

Projeto inicial leve para aplicativo WebView que permite upload de um plano nutricional e conversa com um assistente baseado no documento (RAG).

Como usar (local):

1. Instale dependências:

   npm install

2. Rode em desenvolvimento:

   npm run dev

Observações:
- O frontend traz um serviço `src/services/api.js` com fallback local. Configure `VITE_API_BASE_URL` no `.env` para apontar um backend (ex: `http://localhost:3000`).

PWA & Deploy
- O projeto inclui um `manifest.json` e um `sw.js` (service worker) simples em `public/` para cache offline básico.
- Ícones estão em `public/icons/` (SVG). Para melhor compatibilidade com todas as lojas WebView, substitua por PNGs reais se necessário.

Deploy recomendado:

- Vercel (fácil): crie um projeto apontando para este repositório. A `vercel.json` já contém uma rota SPA. O build usa `npm run build`.

- S3 + CloudFront: executar `npm run build` e fazer upload da pasta `dist/` para um bucket S3 configurado para site estático; configurar CloudFront com comportamento padrão apontando para o bucket.

Observação sobre o service worker:
- O `sw.js` presente é minimalista e cacheia alguns ativos para offline. Em produção, considere usar `workbox` ou `vite-plugin-pwa` para políticas mais robustas.
