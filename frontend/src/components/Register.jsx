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
    if (id === 'dateOfBirth') {
      // Máscara simples para DD/MM/AAAA
      let v = value.replace(/\D/g, '').slice(0, 8)
      if (v.length >= 5) {
        v = `${v.slice(0, 2)}/${v.slice(2, 4)}/${v.slice(4)}`
      } else if (v.length >= 3) {
        v = `${v.slice(0, 2)}/${v.slice(2)}`
      }
      setFormData(prev => ({ ...prev, [id]: v }))
      return
    }
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleDateFromCalendar = (e) => {
    const dateValue = e.target.value // Formato AAAA-MM-DD
    if (!dateValue) return
    const [year, month, day] = dateValue.split('-')
    const formattedDate = `${day}/${month}/${year}`
    setFormData(prev => ({ ...prev, dateOfBirth: formattedDate }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    // Validar formato DD/MM/AAAA
    if (formData.dateOfBirth.length < 10) {
      setError('Data de nascimento inválida. Use DD/MM/AAAA.')
      setLoading(false)
      return
    }

    try {
      await register(formData)
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
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm p-4" style={{ maxWidth: '450px', width: '100%' }}>
        <div className="card-body">
          <div className="text-center mb-4">
            <h3 className="text-primary fw-bold">NutriSmart</h3>
            <p className="text-muted small">Crie sua conta</p>
          </div>
          
          {success ? (
            <div className="text-center p-2">
              <div className="mb-3">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
              </div>
              <h4 className="text-success fw-bold">Cadastro Realizado!</h4>
              <p className="text-muted small">Sua conta está pronta. Redirecionando...</p>
              <Link to="/login" className="btn btn-primary w-100 mt-3 py-2">
                Ir para Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="fullName" className="form-label small">Nome Completo</label>
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
                <label htmlFor="email" className="form-label small">E-mail</label>
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
                <label htmlFor="password" className="form-label small">Senha</label>
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
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="dateOfBirth" className="form-label small">Nascimento</label>
                  <div className="input-group">
                    <input 
                      type="text" 
                      className="form-control"
                      id="dateOfBirth"
                      value={formData.dateOfBirth} 
                      onChange={handleChange} 
                      placeholder="DD/MM/AAAA"
                      required 
                    />
                    <div className="position-relative">
                      <button 
                        type="button"
                        className="btn btn-outline-secondary border-start-0 h-100 px-3"
                        onClick={() => document.getElementById('calendar-input').showPicker?.() || document.getElementById('calendar-input').click()}
                        style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                      >
                        <i className="bi bi-calendar-event"></i>
                      </button>
                      <input 
                        type="date"
                        id="calendar-input"
                        className="position-absolute invisible"
                        style={{ top: 0, left: 0, width: '100%', height: '100%' }}
                        onChange={handleDateFromCalendar}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="phone" className="form-label small">Telefone</label>
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
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary w-100 py-2 mb-3"
                disabled={loading}
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
              
              {error && <div className="alert alert-danger py-2 small" role="alert">{error}</div>}
              
              <div className="text-center mt-2">
                <Link to="/login" className="text-decoration-none text-secondary small">
                  Já tem conta? Faça login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
