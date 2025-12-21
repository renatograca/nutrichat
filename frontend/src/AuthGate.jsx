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
    <div className="authed-root">
      <div className="topbar">
        <button onClick={handleLogout}>Sair</button>
      </div>
      {children}
    </div>
  )
}
