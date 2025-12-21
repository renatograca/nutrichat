import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import { logout, validateToken } from './services/auth'

function hasToken() {
  try { return !!localStorage.getItem('auth_token') } catch { return false }
}

export default function AuthGate({ children }) {
  const [authed, setAuthed] = useState(hasToken())
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    async function checkAuth() {
      if (hasToken()) {
        const isValid = await validateToken()
        setAuthed(!!isValid)
      } else {
        setAuthed(false)
      }
      setLoading(false)
    }
    checkAuth()
  }, [])

  useEffect(() => {
    if (!loading) {
      setAuthed(hasToken())
    }
  }, [location, loading])

  function handleLoginSuccess() {
    setAuthed(true)
    navigate('/')
  }

  function handleLogout() {
    logout()
    setAuthed(false)
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
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
    <div className="d-flex flex-column h-100">
      <nav className="navbar navbar-light bg-white border-bottom fixed-top">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1 text-primary fw-bold">NutriSmart</span>
          <button className="btn btn-sm btn-outline-secondary" onClick={handleLogout}>Sair</button>
        </div>
      </nav>
      <main className="flex-grow-1 overflow-hidden" style={{ paddingTop: '56px' }}>
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
