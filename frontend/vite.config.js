import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite'
import Terminal from 'vite-plugin-terminal'

export default defineConfig({
  plugins: [
    Terminal({
      console: 'terminal',
      output: ['error', 'warn', 'info', 'log']
    }),
    tailwindcss(),
    react(),
    VitePWA({
      manifest: {
        name: "NutriChat - Seu Assistente de Plano Alimentar",
        short_name: "NutriChat",
        description: "Assistente inteligente para planejamento alimentar",
        theme_color: "#4CAF50",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          {
            src: "logo192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "logo512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              },
              networkTimeoutSeconds: 10
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      },
    })
  ]
});