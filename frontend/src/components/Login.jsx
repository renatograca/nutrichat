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
    <div className="login-screen">
      <h2>Entrar</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          E-mail
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Senha
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  )
}
