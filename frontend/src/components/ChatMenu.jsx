import React, { useState } from 'react'
import { createChat, deleteChat } from '../services/chatApi'

export default function ChatMenu({ isOpen, onClose, onSelectChat, currentChatId, chats, loading, onRefreshChats }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [chatToDelete, setChatToDelete] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const handleNewChat = async () => {
    try {
      const newChat = await createChat()
      if (onRefreshChats) await onRefreshChats()
      onSelectChat(newChat.id)
      onClose()
    } catch (err) {
      setErrorMessage('Erro ao criar novo chat. Tente novamente.')
      setShowErrorModal(true)
    }
  }

  const handleDeleteChat = (e, chatId) => {
    e.stopPropagation()
    setChatToDelete(chatId)
    setShowDeleteModal(true)
  }

  const confirmDelete = async () => {
    if (!chatToDelete) return
    
    try {
      setDeleting(true)
      await deleteChat(chatToDelete)
      if (onRefreshChats) await onRefreshChats()
      if (currentChatId === chatToDelete) {
        onSelectChat(null)
      }
      setShowDeleteModal(false)
      setChatToDelete(null)
    } catch (err) {
      setErrorMessage('Erro ao apagar chat. Verifique sua conexão.')
      setShowErrorModal(true)
    } finally {
      setDeleting(false)
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

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div 
          className="fixed-top w-100 h-100 d-flex align-items-center justify-content-center px-3"
          style={{ zIndex: 1100 }}
        >
          <div 
            className="position-absolute w-100 h-100 bg-dark opacity-50"
            onClick={() => !deleting && setShowDeleteModal(false)}
          ></div>
          <div className="card border-0 shadow-lg position-relative" style={{ maxWidth: '400px', width: '100%' }}>
            <div className="card-body p-4 text-center">
              <div className="mb-3">
                <i className="bi bi-exclamation-circle text-danger fs-1"></i>
              </div>
              <h5 className="card-title fw-bold mb-2">Apagar conversa?</h5>
              <p className="card-text text-muted mb-4">
                Esta ação não poderá ser desfeita e todo o histórico será perdido.
              </p>
              <div className="d-flex gap-2 justify-content-center">
                <button 
                  className="btn btn-light rounded-pill px-4"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                >
                  Cancelar
                </button>
                <button 
                  className="btn btn-danger rounded-pill px-4"
                  onClick={confirmDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Apagando...
                    </>
                  ) : 'Apagar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div 
          className="fixed-top w-100 h-100 d-flex align-items-center justify-content-center px-3"
          style={{ zIndex: 1100 }}
        >
          <div 
            className="position-absolute w-100 h-100 bg-dark opacity-50"
            onClick={() => setShowErrorModal(false)}
          ></div>
          <div className="card border-0 shadow-lg position-relative" style={{ maxWidth: '400px', width: '100%' }}>
            <div className="card-body p-4 text-center">
              <div className="mb-3">
                <i className="bi bi-exclamation-circle text-danger fs-1"></i>
              </div>
              <h5 className="card-title fw-bold mb-2">Ops! Ocorreu um erro</h5>
              <p className="card-text text-muted mb-4">
                {errorMessage}
              </p>
              <div className="d-flex justify-content-center">
                <button 
                  className="btn btn-primary rounded-pill px-5"
                  onClick={() => setShowErrorModal(false)}
                >
                  Entendido
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
