import React, { useState } from 'react'
import { sendMessage } from '../services/api'

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
    <section className="chat">
      <div className="messages" role="log" aria-live="polite">
        {messages.length === 0 && <div className="empty">Nenhuma mensagem ainda — envie seu plano ou pergunte algo.</div>}
        {messages.map((m, i) => (
          <div key={i} className={`message ${m.role}`}>
            <div className="bubble">{m.text}</div>
          </div>
        ))}
      </div>
      <form className="composer" onSubmit={handleSend}>
        <input
          aria-label="mensagem"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Digite sua pergunta..."
        />
        <button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar'}</button>
      </form>
    </section>
  )
}
