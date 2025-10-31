import { registerSW } from 'virtual:pwa-register'

export function register() {
  if ('serviceWorker' in navigator) {
    registerSW({
      onNeedRefresh() {
        if (confirm('Nova versão disponível. Recarregar?')) {
          window.location.reload()
        }
      },
      onOfflineReady() {
        console.log('Aplicativo pronto para uso offline')
      }
    })
  }
}

