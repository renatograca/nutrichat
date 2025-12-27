import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App'
import AuthGate from './AuthGate'
import './styles/main.css'

const root = createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <AuthGate>
      <App />
    </AuthGate>
  </BrowserRouter>
)
