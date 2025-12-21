import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import AuthGate from './AuthGate'
import './styles/main.css'
import { register as registerServiceWorker } from './registerServiceWorker'

const root = createRoot(document.getElementById('root'))
root.render(
	<AuthGate>
		<App />
	</AuthGate>
)

// registrar service worker apenas em produção
registerServiceWorker()
