import React, { useState } from 'react'
import { sendMessage } from '../services/chat'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSend(e) {
    e?.preventDefault()
    if (!input.trim()) return
    const userMsg = { role: 'user', text: input }
    setMessages((m) => [...m, userMsg])
    setInput('')
    setLoading(true)
    try {
      const reply = await sendMessage(input)
      setMessages((m) => [...m, { role: 'assistant', text: reply }])
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', text: 'Erro ao consultar backend.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="d-flex flex-column" style={{ height: '500px' }}>
      <div className="flex-grow-1 overflow-auto mb-3 p-3 bg-light rounded" role="log" aria-live="polite">
        {messages.length === 0 && (
          <div className="text-center text-muted py-5">
            <p className="mb-0">Nenhuma mensagem ainda — envie seu plano ou pergunte algo.</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 d-flex ${m.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
            <div className={`p-3 rounded ${m.role === 'user' ? 'bg-primary text-white' : 'bg-secondary text-white'}`} style={{ maxWidth: '75%' }}>
              <p className="mb-0">{m.text}</p>
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} className="d-flex gap-2">
        <input
          type="text"
          className="form-control form-control-lg"
          aria-label="mensagem"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua pergunta..."
        />
        <button type="submit" className="btn btn-primary btn-lg px-4" disabled={loading}>
          {loading ? '⏳' : '📨'}
        </button>
      </form>
    </div>
  )
}
