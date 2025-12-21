import React, { useState, useEffect, useRef } from 'react'
import { getMessages, sendMessage, deleteChat } from '../services/chatApi'
import ChatHeader from '../components/ChatHeader'
import MessageBubble from '../components/MessageBubble'
import EmptyState from '../components/EmptyState'

export default function ChatView({ chatId, onBack }) {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  
  const scrollRef = useRef(null)

  useEffect(() => {
    if (chatId) {
      loadMessages()
    }
  }, [chatId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }

  const loadMessages = async () => {
    try {
      setLoading(true)
      const data = await getMessages(chatId)
      setMessages(data)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar mensagens.')
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!inputText.trim() || sending) return

    const userMsg = {
      id: Date.now(),
      text: inputText,
      role: 'user',
      created_at: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMsg])
    setInputText('')
    setSending(true)

    try {
      const response = await sendMessage(chatId, userMsg.text)
      setMessages(prev => [...prev, response])
    } catch (err) {
      alert('Erro ao enviar mensagem.')
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Deseja apagar esta conversa?')) {
      try {
        await deleteChat(chatId)
        onBack()
      } catch (err) {
        alert('Erro ao apagar conversa.')
      }
    }
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column h-100 bg-white">
      <ChatHeader 
        title={`Conversa #${chatId.slice(0, 5)}`} 
        onBack={onBack} 
        onDelete={handleDelete}
      />

      <div 
        ref={scrollRef}
        className="flex-grow-1 overflow-auto p-3 bg-light"
      >
        {messages.length === 0 ? (
          <EmptyState 
            icon="chat-left-text"
            title="Comece a conversa"
            message="Envie uma mensagem abaixo para começar a tirar suas dúvidas."
          />
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble key={msg.id || idx} message={msg} />
          ))
        )}
        {sending && (
          <div className="d-flex justify-content-start mb-3">
            <div className="bg-white p-3 rounded-3 shadow-sm border">
              <div className="spinner-grow spinner-grow-sm text-primary me-1" role="status"></div>
              <div className="spinner-grow spinner-grow-sm text-primary me-1" role="status"></div>
              <div className="spinner-grow spinner-grow-sm text-primary" role="status"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-top bg-white">
        <form onSubmit={handleSend} className="d-flex gap-2">
          <input
            type="text"
            className="form-control rounded-pill px-4"
            placeholder="Digite sua dúvida..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={sending}
          />
          <button 
            type="submit" 
            className="btn btn-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
            style={{ width: '45px', height: '45px' }}
            disabled={!inputText.trim() || sending}
          >
            <i className="bi bi-send-fill"></i>
          </button>
        </form>
      </div>
    </div>
  )
}
