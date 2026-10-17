import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginWithPhone } from '../services/auth'

export default function PhoneLogin({ onLoginSuccess }) {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function formatPhone(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return digits
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  function handleChange(e) {
    setPhone(formatPhone(e.target.value))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginWithPhone({ phone })
      onLoginSuccess()
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError('Não foi possível conectar ao servidor. Verifique sua conexão.')
      } else {
        setError('Falha no login. Verifique o telefone.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body">
          <div className="text-center mb-4">
            <h3 className="text-primary fw-bold">NutriChat</h3>
            <p className="text-muted small">Faça login com seu telefone</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">Telefone</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                value={phone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 py-2 mb-3"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>

            {error && <div className="alert alert-danger mt-3 py-2 small" role="alert">{error}</div>}
          </form>
        </div>
      </div>
    </div>
  )
}
