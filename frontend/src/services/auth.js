import { USER_BASE_URL } from './config'

export async function login({ email, password }) {
  const res = await fetch(`${USER_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) throw new Error('login failed')
  const data = await res.json()
  if (data?.token) {
    try { localStorage.setItem('auth_token', data.token) } catch {}
  }
  return data
}

export async function validateToken() {
  const token = localStorage.getItem('auth_token')
  if (!token) return null
  const res = await fetch(`${USER_BASE_URL}/auth/validate`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  if (!res.ok) {
    logout()
    return null
  }
  return await res.json()
}

export function logout() {
  try { localStorage.removeItem('auth_token') } catch {}
}
