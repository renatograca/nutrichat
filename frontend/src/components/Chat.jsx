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
    <div className="d-flex flex-column" style={{ height: 'calc(100vh - 56px)' }}>
      <div className="flex-grow-1 overflow-auto p-3" style={{ marginBottom: '70px' }}>
        {messages.length === 0 && (
          <div className="text-center text-muted py-5 mt-5">
            <i className="bi bi-chat-dots fs-1 d-block mb-3 opacity-25"></i>
            <p className="mb-0">Como posso ajudar na sua dieta hoje?</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`mb-3 d-flex ${m.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
            {m.role === 'assistant' && (
              <div className="me-2 mt-auto">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                  <i className="bi bi-robot small"></i>
                </div>
              </div>
            )}
            <div 
              className={`p-3 rounded-3 ${m.role === 'user' ? 'chat-bubble-user text-dark' : 'bg-light border chat-bubble-ia'}`}
            >
              <div className="mb-0" dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br/>') }} />
            </div>
          </div>
        ))}
        {loading && (
          <div className="d-flex justify-content-start mb-3">
            <div className="me-2 mt-auto">
              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>
                <i className="bi bi-robot small"></i>
              </div>
            </div>
            <div className="bg-light border p-3 rounded-3 chat-bubble-ia">
              <div className="spinner-grow spinner-grow-sm text-primary" role="status"></div>
            </div>
          </div>
        )}
      </div>
      
      <div className="fixed-bottom bg-white border-top p-3">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              <form onSubmit={handleSend}>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control rounded-pill-start border-end-0 py-2 ps-4"
                    aria-label="mensagem"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Pergunte sobre sua dieta..."
                    style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                  />
                  <button 
                    type="submit" 
                    className="btn btn-primary rounded-pill-end px-4" 
                    disabled={loading}
                    style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                  >
                    <i className="bi bi-send-fill"></i>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
