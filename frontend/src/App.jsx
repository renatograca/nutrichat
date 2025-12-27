import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import ChatMenu from './components/ChatMenu'
import ChatView from './pages/ChatView'
import EmptyState from './components/EmptyState'
import { createChat, getChats } from './services/chatApi'

export default function App({ onLogout }) {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loadingInitial, setLoadingInitial] = useState(true)
  const [chats, setChats] = useState([])
  const [loadingChats, setLoadingChats] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const selectedChatId = chatId || null

  const setSelectedChatId = (id) => {
    if (id) {
      navigate(`/chat/${id}`)
    } else {
      navigate('/')
    }
  }

  const loadChats = async () => {
    try {
      setLoadingChats(true)
      const data = await getChats()
      setChats(data || [])
      return data
    } catch (err) {
      console.error('Erro ao carregar conversas:', err)
      return []
    } finally {
      setLoadingChats(false)
    }
  }

  useEffect(() => {
    const init = async () => {
      const data = await loadChats()
      // Se não houver chatId na URL, tenta carregar o último
      if (!chatId && data && data.length > 0) {
        const sorted = [...data].sort((a, b) => 
          new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at)
        )
        setSelectedChatId(sorted[0].id)
      }
      setLoadingInitial(false)
    }
    init()
  }, [])

  const handleNewChat = async () => {
    try {
      const newChat = await createChat()
      await loadChats()
      setSelectedChatId(newChat.id)
      setIsMenuOpen(false)
    } catch (err) {
      setErrorMessage('Não foi possível criar uma nova conversa no momento.')
      setShowErrorModal(true)
    }
  }

  if (loadingInitial) {
    return (
      <div className="d-flex align-items-center justify-content-center h-100 bg-light">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="d-flex flex-column h-100 bg-light">
      <Header 
        onMenuClick={() => setIsMenuOpen(true)} 
        onLogout={onLogout} 
      />

      <ChatMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        onSelectChat={setSelectedChatId}
        currentChatId={selectedChatId}
        chats={chats}
        loading={loadingChats}
        onRefreshChats={loadChats}
      />

      <main className="flex-grow-1 overflow-hidden position-relative">
        <div className="container-fluid h-100 p-0">
          <div className="row g-0 justify-content-center h-100">
            <div className="col-12 col-md-10 col-lg-8 h-100 shadow-sm bg-white">
              {selectedChatId ? (
                <ChatView 
                  chatId={selectedChatId} 
                  onBack={() => setSelectedChatId(null)} 
                  onTitleUpdate={loadChats}
                />
              ) : (
                <EmptyState 
                  icon="chat-dots"
                  title="Bem-vindo ao NutriChat"
                  message="Selecione uma conversa no menu ou inicie uma nova para começar."
                  action={{ label: 'Nova Conversa', onClick: handleNewChat }}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Erro Global */}
      {showErrorModal && (
        <div 
          className="fixed-top w-100 h-100 d-flex align-items-center justify-content-center px-3"
          style={{ zIndex: 2000 }}
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
    </div>
  )
}
