const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

export async function sendMessage(text) {
  // Tenta usar um backend; se não houver, responde com mensagem de fallback.
  try {
    if (!API_BASE) throw new Error('no api')
    const res = await fetch(`${API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const res = await fetch(`${API_BASE}/api/documents`, {
      method: 'POST',
      body: fd
    })
    if (!res.ok) throw new Error('upload failed')
    return await res.json()
  } catch (err) {
    // fallback: apenas simula sucesso localmente
    return { ok: true }
  }
}
