import { USER_BASE_URL } from './config'

export async function login({ email, password }) {
  const res = await fetch(`${USER_BASE_URL}/auth`, {
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

export function logout() {
  try { localStorage.removeItem('auth_token') } catch {}
}
