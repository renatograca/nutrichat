import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../services/auth'

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      onLoginSuccess()
    } catch (err) {
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError('Não foi possível conectar ao servidor. Verifique sua conexão.')
      } else if (err.status === 404 && err.message === 'User not found') {
        setShowModal(true)
      } else {
        setError('Falha no login. Verifique credenciais.')
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
            <h3 className="text-primary fw-bold d-flex align-items-center justify-content-center gap-2">
              <i className="bi bi-pear-fill"></i>
              NutriChat
            </h3>
            <p className="text-muted small">Faça login para continuar</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">E-mail</label>
              <input 
                type="email" 
                className="form-control"
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
                className="form-control"
                id="password"
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Sua senha"
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
            
            <div className="text-center">
              <Link to="/register" className="text-decoration-none text-secondary small">
                Não tem conta? Cadastre-se
              </Link>
            </div>

            {error && <div className="alert alert-danger mt-3 py-2 small" role="alert">{error}</div>}
          </form>
        </div>
      </div>

      {/* Modal User Not Found */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header border-0 pb-0 justify-content-center position-relative">
                <h5 className="modal-title fw-bold text-primary w-100 text-center">Usuário não encontrado</h5>
                <button type="button" className="btn-close position-absolute end-0 me-3" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body py-4 text-center">
                <p className="mb-0">Este usuário não está cadastrado em nosso sistema.</p>
                <p className="text-muted small">Deseja criar uma conta agora?</p>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-light" onClick={() => setShowModal(false)}>Fechar</button>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => {
                    setShowModal(false)
                    navigate('/register')
                  }}
                >
                  Cadastrar-se
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
