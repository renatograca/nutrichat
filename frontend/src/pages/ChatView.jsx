import React, { useState, useEffect, useRef } from 'react'
import { getMessages, sendMessage, getChat } from '../services/chatApi'
import MessageBubble from '../components/MessageBubble'
import UploadDocumentButton from '../components/UploadDocumentButton'

export default function ChatView({ chatId, onBack }) {
  const [messages, setMessages] = useState([])
  const [chatInfo, setChatInfo] = useState(null)
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
  
  const scrollRef = useRef(null)

  useEffect(() => {
    if (chatId) {
      loadChatData()
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

  const loadChatData = async () => {
    try {
      setLoading(true)
      const [info, msgs] = await Promise.all([
        getChat(chatId),
        getMessages(chatId)
      ])
      setChatInfo(info)
      setMessages(msgs)
      setError(null)
    } catch (err) {
      setError('Erro ao carregar dados do chat.')
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    if (!inputText.trim() || sending || !chatInfo?.document_id) return

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

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  const hasDocument = !!chatInfo?.document_id

  return (
    <div className="d-flex flex-column h-100 bg-white">
      {/* Design mais limpo e focado em conversa */}
      <div 
        ref={scrollRef}
        className="flex-grow-1 overflow-auto p-3"
      >
        {!hasDocument ? (
          <UploadDocumentButton 
            chatId={chatId} 
            onUploadSuccess={loadChatData} 
          />
        ) : messages.length === 0 ? (
          <div className="text-center p-5 text-muted">
            <i className="bi bi-chat-dots fs-1 mb-3 d-block"></i>
            <p>Plano alimentar carregado! Pergunte qualquer coisa sobre sua dieta.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble key={msg.id || idx} message={msg} />
          ))
        )}
        
        {sending && (
          <div className="d-flex justify-content-start mb-3">
            <div className="bg-light p-3 rounded-3 shadow-sm">
              <div className="spinner-grow spinner-grow-sm text-primary me-1" role="status"></div>
              <div className="spinner-grow spinner-grow-sm text-primary me-1" role="status"></div>
              <div className="spinner-grow spinner-grow-sm text-primary" role="status"></div>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 border-top bg-white sticky-bottom">
        {!hasDocument && (
          <div className="alert alert-info py-2 small mb-2 text-center">
            <i className="bi bi-info-circle me-2"></i>
            Envie seu plano alimentar para habilitar o chat.
          </div>
        )}
        <form onSubmit={handleSend} className="d-flex gap-2">
          <input
            type="text"
            className="form-control rounded-pill px-4"
            placeholder={hasDocument ? "Digite sua dúvida..." : "Chat desabilitado"}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={sending || !hasDocument}
          />
          <button 
            type="submit" 
            className="btn btn-primary rounded-circle p-2 d-flex align-items-center justify-content-center"
            style={{ width: '45px', height: '45px' }}
            disabled={!inputText.trim() || sending || !hasDocument}
          >
            <i className="bi bi-send-fill"></i>
          </button>
        </form>
      </div>
    </div>
  )
}
