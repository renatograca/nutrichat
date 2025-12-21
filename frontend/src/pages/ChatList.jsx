import React, { useState, useEffect } from 'react'
import { getChats, createChat, deleteChat } from '../services/chatApi'
import ChatHeader from '../components/ChatHeader'
import EmptyState from '../components/EmptyState'

export default function ChatList({ onSelectChat, onLogout }) {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadChats()
  }, [])

  const loadChats = async () => {
    try {
      setLoading(true)
      const data = await getChats()
      setChats(data)
      setError(null)
    } catch (err) {
      setError('Não foi possível carregar as conversas.')
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = async () => {
    try {
      const newChat = await createChat()
      onSelectChat(newChat.id)
    } catch (err) {
      alert('Erro ao criar novo chat.')
    }
  }

  const handleDeleteChat = async (e, chatId) => {
    e.stopPropagation()
    if (window.confirm('Deseja realmente apagar esta conversa?')) {
      try {
        await deleteChat(chatId)
        setChats(chats.filter(c => c.id !== chatId))
      } catch (err) {
        alert('Erro ao apagar chat.')
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
    <div className="d-flex flex-column h-100 bg-light">
      <ChatHeader title="NutriSmart" onLogout={onLogout} />
      
      <div className="flex-grow-1 overflow-auto p-3">
        {error ? (
          <EmptyState 
            icon="exclamation-triangle"
            title="Erro de Conexão"
            message={error}
            action={{ label: 'Tentar Novamente', onClick: loadChats }}
          />
        ) : chats.length === 0 ? (
          <EmptyState 
            icon="chat-dots"
            title="Nenhuma conversa"
            message="Comece uma nova conversa para tirar suas dúvidas nutricionais."
            action={{ label: 'Novo Chat', onClick: handleNewChat }}
          />
        ) : (
          <div className="list-group shadow-sm">
            {chats.map(chat => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className="list-group-item list-group-item-action d-flex justify-content-between align-items-center p-3 border-0 mb-2 rounded shadow-sm"
              >
                <div>
                  <div className="fw-bold text-truncate text-start" style={{ maxWidth: '200px' }}>
                    {chat.title || `Conversa #${chat.id.slice(0, 5)}`}
                  </div>
                  <div className="small text-muted text-start">
                    {new Date(chat.updated_at).toLocaleDateString()}
                  </div>
                </div>
                <button 
                  className="btn btn-link text-danger p-0"
                  onClick={(e) => handleDeleteChat(e, chat.id)}
                >
                  <i className="bi bi-trash"></i>
                </button>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="p-3 bg-white border-top">
        <button 
          className="btn btn-primary w-100 py-3 fw-bold rounded-pill"
          onClick={handleNewChat}
        >
          <i className="bi bi-plus-lg me-2"></i> Nova Conversa
        </button>
      </div>
    </div>
  )
}
