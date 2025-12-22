import React, { useState } from 'react'
import Header from './components/Header'
import ChatMenu from './components/ChatMenu'
import ChatView from './pages/ChatView'
import EmptyState from './components/EmptyState'
import { createChat } from './services/chatApi'

export default function App({ onLogout }) {
  const [selectedChatId, setSelectedChatId] = useState(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleNewChat = async () => {
    try {
      const newChat = await createChat()
      setSelectedChatId(newChat.id)
    } catch (err) {
      alert('Erro ao criar novo chat.')
    }
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
      />

      <main className="flex-grow-1 overflow-hidden position-relative">
        <div className="container-fluid h-100 p-0">
          <div className="row g-0 justify-content-center h-100">
            <div className="col-12 col-md-10 col-lg-8 h-100 shadow-sm bg-white">
              {selectedChatId ? (
                <ChatView 
                  chatId={selectedChatId} 
                  onBack={() => setSelectedChatId(null)} 
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
    </div>
  )
}
