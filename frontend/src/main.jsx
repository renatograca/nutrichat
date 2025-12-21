import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/main.css'
import { register as registerServiceWorker } from './registerServiceWorker'

const root = createRoot(document.getElementById('root'))
root.render(<App />)

// registrar service worker apenas em produção
registerServiceWorker()
