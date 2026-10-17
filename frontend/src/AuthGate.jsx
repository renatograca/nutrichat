import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Login from './components/Login'
import PhoneLogin from './components/PhoneLogin'
import Register from './components/Register'
import OfflineScreen from './components/OfflineScreen'
import { logout, validateToken } from './services/auth'

function isAuthenticated() {
  try { 
    return !!localStorage.getItem('auth_token') && !!localStorage.getItem('user_id')
  } catch { 
    return false 
  }
}

export default function AuthGate({ children }) {
  const [authed, setAuthed] = useState(isAuthenticated())
  const [loading, setLoading] = useState(true)
  const [isOffline, setIsOffline] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  async function checkAuth() {
    setLoading(true)
    setIsOffline(false)
    if (isAuthenticated()) {
      try {
        const isValid = await validateToken()
        setAuthed(!!isValid && !!localStorage.getItem('user_id'))
      } catch (err) {
        if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
          setIsOffline(true)
        } else {
          setAuthed(false)
        }
      }
    } else {
      setAuthed(false)
    }
    setLoading(false)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  function handleLoginSuccess() {
    setAuthed(true)
    navigate('/', { replace: true })
  }

  function handleLogout() {
    logout()
    setAuthed(false)
    navigate('/login', { replace: true })
  }

  if (isOffline) {
    return <OfflineScreen onRetry={checkAuth} />
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

  // Se NÃO estiver autenticado
  if (!authed) {
    return (
      <Routes>
        <Route path="/login" element={<PhoneLogin onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register onRegisterSuccess={() => navigate('/login')} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // Se ESTIVER autenticado
  return (
    <div className="d-flex flex-column h-100 bg-light">
      <main className="flex-grow-1 overflow-hidden">
        <Routes>
          <Route path="/" element={React.cloneElement(children, { onLogout: handleLogout })} />
          <Route path="/chat/:chatId" element={React.cloneElement(children, { onLogout: handleLogout })} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}