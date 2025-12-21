import { USER_BASE_URL } from './config'

export async function login({ email, password }) {
  try {
    const res = await fetch(`${USER_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) throw new Error('login failed')
    const data = await res.json()
    if (data?.token) {
      try { 
        localStorage.setItem('auth_token', data.token) 
        if (data.user_id) localStorage.setItem('user_id', data.user_id)
      } catch {}
    }
    return data
  } catch (err) {
    if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
      throw err // Deixa o componente lidar com offline
    }
    throw err
  }
}

export async function validateToken() {
  const token = localStorage.getItem('auth_token')
  if (!token) return null
  try {
    const res = await fetch(`${USER_BASE_URL}/auth/validate/`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    if (!res.ok) {
      logout()
      return null
    }
    const data = await res.json()
    if (data?.user_id) {
      try { localStorage.setItem('user_id', data.user_id) } catch {}
      return data
    } else {
      // Se validou o token mas não retornou user_id, consideramos inválido para o app
      logout()
      return null
    }
  } catch (err) {
    if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
      throw err
    }
    logout()
    return null
  }
}

export function logout() {
  try { 
    localStorage.removeItem('auth_token') 
    localStorage.removeItem('user_id')
  } catch {}
}
