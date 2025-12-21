import React, { useState } from 'react'
import { login } from '../services/api'

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      onLoginSuccess()
    } catch (err) {
      setError('Falha no login. Verifique credenciais.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-4 text-primary">NutriChat</h2>
          <p className="text-center text-muted mb-4">Faça login para continuar</p>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">E-mail</label>
              <input 
                type="email" 
                className="form-control form-control-lg"
                id="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="seu@email.com"
                required 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Senha</label>
              <input 
                type="password" 
                className="form-control form-control-lg"
                id="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Sua senha"
                required 
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary btn-lg w-100 mb-3"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            {error && <div className="alert alert-danger" role="alert">{error}</div>}
            <p className="text-center text-muted small mt-4">
              Credenciais demo: renato@email.com / senha
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
