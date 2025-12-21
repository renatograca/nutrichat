import React, { useState } from 'react'
import Login from './components/Login'
import { logout } from './services/api'

function hasToken() {
  try { return !!localStorage.getItem('auth_token') } catch { return false }
}

export default function AuthGate({ children }) {
  const [authed, setAuthed] = useState(hasToken())

  function handleLoginSuccess() {
    setAuthed(true)
  }

  function handleLogout() {
    logout()
    setAuthed(false)
  }

  if (!authed) {
    return <Login onLoginSuccess={handleLoginSuccess} />
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-dark bg-primary shadow">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">NutriChat</span>
          <button className="btn btn-outline-light" onClick={handleLogout}>Sair</button>
        </div>
      </nav>
      <main className="flex-grow-1 py-4">
        {children}
      </main>
    </div>
  )
}
