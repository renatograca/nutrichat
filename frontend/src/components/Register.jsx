import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../services/user'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    dateOfBirth: '',
    phone: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // Formatar data se necessário (o input date geralmente vem como YYYY-MM-DD)
    // O backend espera dd/MM/yyyy
    let formattedDate = formData.dateOfBirth
    if (formData.dateOfBirth.includes('-')) {
        const [year, month, day] = formData.dateOfBirth.split('-')
        formattedDate = `${day}/${month}/${year}`
    }

    try {
      await register({ ...formData, dateOfBirth: formattedDate })
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError('Falha no cadastro. Verifique os dados.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow" style={{ width: '100%', maxWidth: '450px' }}>
        <div className="card-body p-5">
          <h2 className="card-title text-center mb-4 text-primary">NutriChat</h2>
          <p className="text-center text-muted mb-4">Crie sua conta</p>
          
          {success ? (
            <div className="alert alert-success" role="alert">
              Cadastro realizado com sucesso! Redirecionando para o login...
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label">Nome Completo</label>
                <input 
                  type="text" 
                  className="form-control"
                  id="fullName"
                  value={formData.fullName} 
                  onChange={handleChange} 
                  placeholder="Seu nome completo"
                  required 
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">E-mail</label>
                <input 
                  type="email" 
                  className="form-control"
                  id="email"
                  value={formData.email} 
                  onChange={handleChange} 
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
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="Sua senha"
                  required 
                />
              </div>
              <div className="mb-3">
                <label htmlFor="dateOfBirth" className="form-label">Data de Nascimento</label>
                <input 
                  type="date" 
                  className="form-control"
                  id="dateOfBirth"
                  value={formData.dateOfBirth} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">Telefone</label>
                <input 
                  type="tel" 
                  className="form-control"
                  id="phone"
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="Ex: 75982389131"
                  required 
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary btn-lg w-100 mb-3"
                disabled={loading}
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
              
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              
              <div className="text-center mt-3">
                <Link to="/login" className="btn btn-link">
                  Já tem uma conta? Faça login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
