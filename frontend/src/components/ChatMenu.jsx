import React, { useState, useEffect } from 'react'
import { getChats, createChat, deleteChat } from '../services/chatApi'

export default function ChatMenu({ isOpen, onClose, onSelectChat, currentChatId }) {
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadChats()
    }
  }, [isOpen])

  const loadChats = async () => {
    try {
      setLoading(true)
      const data = await getChats()
      setChats(data)
    } catch (err) {
      console.error('Erro ao carregar conversas:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleNewChat = async () => {
    try {
      const newChat = await createChat()
      onSelectChat(newChat.id)
      onClose()
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
        if (currentChatId === chatId) {
          onSelectChat(null)
        }
      } catch (err) {
        alert('Erro ao apagar chat.')
      }
    }
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed-top w-100 h-100 bg-dark transition-opacity ${isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'}`}
        style={{ zIndex: 1040, display: isOpen ? 'block' : 'none' }}
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div 
        className="fixed-top h-100 bg-white shadow transition-transform"
        style={{ 
          zIndex: 1050, 
          width: '280px', 
          left: 0,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div className="d-flex flex-column h-100">
          <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold text-primary">NutriChat</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="p-3">
            <button 
              className="btn btn-primary w-100 rounded-pill d-flex align-items-center justify-content-center gap-2 mb-3"
              onClick={handleNewChat}
            >
              <i className="bi bi-plus-lg"></i> Nova Conversa
            </button>
          </div>

          <div className="flex-grow-1 overflow-auto px-3 pb-3">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border spinner-border-sm text-primary" role="status"></div>
              </div>
            ) : chats.length === 0 ? (
              <p className="text-muted text-center small py-4">Nenhuma conversa encontrada.</p>
            ) : (
              <div className="list-group list-group-flush">
                {chats.map(chat => (
                  <div
                    key={chat.id}
                    onClick={() => {
                      onSelectChat(chat.id)
                      onClose()
                    }}
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center border-0 rounded mb-1 ${currentChatId === chat.id ? 'active' : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="text-truncate me-2">
                      <div className="fw-medium small text-truncate">
                        {chat.title || `Conversa #${chat.id.slice(0, 5)}`}
                      </div>
                      <div className="extra-small opacity-75" style={{ fontSize: '0.7rem' }}>
                        {new Date(chat.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                    <button 
                      className={`btn btn-link btn-sm p-0 ${currentChatId === chat.id ? 'text-white' : 'text-danger'}`}
                      onClick={(e) => handleDeleteChat(e, chat.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
