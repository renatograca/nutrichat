// Registra service worker em produção (arquivo em /public/sw.js)
export function register() {
  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => console.log('Service worker registrado:', reg.scope))
        .catch((err) => console.warn('Falha ao registrar SW:', err))
    })
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach(r => r.unregister()))
  }
}
