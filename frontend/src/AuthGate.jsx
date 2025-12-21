import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import { logout } from './services/auth'

function hasToken() {
  try { return !!localStorage.getItem('auth_token') } catch { return false }
}

export default function AuthGate({ children }) {
  const [authed, setAuthed] = useState(hasToken())
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    setAuthed(hasToken())
  }, [location])

  function handleLoginSuccess() {
    setAuthed(true)
    navigate('/')
  }

  function handleLogout() {
    logout()
    setAuthed(false)
    navigate('/login')
  }

  if (!authed) {
    return (
      <Routes>
        <Route 
          path="/login" 
          element={<Login onLoginSuccess={handleLoginSuccess} />} 
        />
        <Route 
          path="/register" 
          element={<Register onRegisterSuccess={() => navigate('/login')} />} 
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
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
        <Routes>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          <Route path="/" element={children} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}
