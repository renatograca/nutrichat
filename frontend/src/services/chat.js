import {CHAT_BASE_URL, getToken, getUserId} from './config'

export async function sendMessage(text) {
  // Tenta usar um backend; se não houver, responde com mensagem de fallback.
  try {
    if (!CHAT_BASE_URL) throw new Error('no api')
    const headers = { 'Content-Type': 'application/json' }
    const token = getToken()
    const userId = getUserId()
    
    if (token) headers['Authorization'] = `Bearer ${token}`
    
    const body = { text }
    if (userId) body.user_id = userId

    const res = await fetch(`${CHAT_BASE_URL}/api/chat/`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    })
    if (!res.ok) throw new Error('bad response')
    const data = await res.json()
    return data.text || 'Sem resposta.'
  } catch (err) {
    if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
      throw err // Permite que o componente lide com a falha de conexão
    }
    // fallback local — indica ao usuário que o backend não está conectado
    return 'Ainda não há backend conectado. Faça upload do plano para usar o assistente RAG.'
  }
}

export async function uploadFile(file) {
  try {
    if (!CHAT_BASE_URL) throw new Error('no api')
    const fd = new FormData()
    fd.append('file', file)
    
    const userId = getUserId()
    if (userId) fd.append('user_id', userId)

    const token = getToken()
    const headers = token ? { 'Authorization': `Bearer ${token}` } : undefined
    const res = await fetch(`${CHAT_BASE_URL}/api/documents/`, {
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
