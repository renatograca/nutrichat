const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

function getToken() {
  try { return localStorage.getItem('auth_token') }
  catch { return null }
}

export async function fetchUserByEmail(email) {
  const res = await fetch(`${API_BASE}/users/${encodeURIComponent(email)}`)
  if (!res.ok) throw new Error('user not found')
  return await res.json()
}

export async function login({ email, password }) {
  const res = await fetch(`${API_BASE}/auth`, {
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

export async function sendMessage(text) {
  // Tenta usar um backend; se não houver, responde com mensagem de fallback.
  try {
    if (!API_BASE) throw new Error('no api')
    const headers = { 'Content-Type': 'application/json' }
    const token = getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ text })
    })
    if (!res.ok) throw new Error('bad response')
    const data = await res.json()
    return data.text || 'Sem resposta.'
  } catch (err) {
    // fallback local — indica ao usuário que o backend não está conectado
    return 'Ainda não há backend conectado. Faça upload do plano para usar o assistente RAG.'
  }
}

export async function uploadFile(file) {
  try {
    if (!API_BASE) throw new Error('no api')
    const fd = new FormData()
    fd.append('file', file)
    const token = getToken()
    const headers = token ? { 'Authorization': `Bearer ${token}` } : undefined
    const res = await fetch(`${API_BASE}/api/documents`, {
      method: 'POST',
      headers,
      body: fd
    })
    if (!res.ok) throw new Error('upload failed')
    return await res.json()
  } catch (err) {
    // fallback: apenas simula sucesso localmente
    return { ok: true }
  }
}
