import React, { useState, useRef } from 'react'
import { BASE_URL } from '../config'

export default function Chat({ documentId }) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [docId, setDocId] = useState(documentId)
  const fileInputRef = useRef(null)

  async function handleFileUpload(file) {
    if (!file) return
    setLoading(true)
    setMessages(prev => [...prev, { role: 'user', text: `📄 Enviando "${file.name}"...` }])
    const fd = new FormData()
    fd.append('file', file)

    try {
      const res = await fetch((BASE_URL || '') + '/api/documents/upload', {
        method: 'POST',
        body: fd
      })
      const data = await res.json()
      setDocId(data.documentId)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: `✅ Documento "${file.name}" carregado com sucesso e indexado.` }
      ])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'assistant', text: '❌ Erro ao enviar o arquivo.' }])
    } finally {
      setLoading(false)
    }
  }

  async function sendQuestion(e) {
    e && e.preventDefault()
    if (!docId) return alert('Envie um plano nutricional primeiro.')
    if (!question.trim()) return
    const userMsg = { role: 'user', text: question }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    try {
      const res = await fetch((BASE_URL || '') + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: docId, question })
      })
      const data = await res.json()
      const botMsg = { role: 'assistant', text: data.answer, sources: data.sources }
      setMessages(prev => [...prev, botMsg])
      setQuestion('')
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'assistant', text: 'Erro ao consultar o backend.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleFileSelect(e) {
    const file = e.target.files[0]
    if (file) handleFileUpload(file)
  }

  return (
    <div className="card chat">
      <h2>Chat</h2>
      <div
        className="chat-window"
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault()
          const file = e.dataTransfer.files[0]
          if (file) handleFileUpload(file)
        }}
      >
        {messages.length === 0 && <div className="empty">Envie uma pergunta ou arraste seu plano aqui 📎</div>}
        {messages.map((m, i) => (
          <div key={i} className={'msg ' + (m.role === 'user' ? 'user' : 'bot')}>
            <div className="msg-text">{m.text}</div>
            {m.sources && m.sources.length > 0 && (
              <div className="msg-sources">
                Fontes:{' '}
                {m.sources.map((s, idx) => (
                  <code key={idx}>{s.length > 30 ? s.substring(0, 30) + '...' : s}</code>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={sendQuestion} className="chat-form">
        <input
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder={docId ? 'Digite sua pergunta ou envie um arquivo...' : 'Envie um plano ou arquivo aqui...'}
        />
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileSelect}
        />
        <button type="button" className="attach-btn" onClick={() => fileInputRef.current.click()}>
          📎
        </button>
        <button type="submit" disabled={loading}>
          {loading ? '⏳' : 'Enviar'}
        </button>
      </form>
    </div>
  )
}
