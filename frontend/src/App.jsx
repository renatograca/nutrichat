import React, { useState } from 'react'
import ChatList from './pages/ChatList'
import ChatView from './pages/ChatView'

export default function App({ onLogout }) {
  const [selectedChatId, setSelectedChatId] = useState(null)

  return (
    <div className="container-fluid p-0 h-100">
      <div className="row g-0 justify-content-center h-100">
        <div className="col-12 col-md-10 col-lg-8 h-100 shadow-sm bg-white">
          {!selectedChatId ? (
            <ChatList onSelectChat={setSelectedChatId} onLogout={onLogout} />
          ) : (
            <ChatView 
              chatId={selectedChatId} 
              onBack={() => setSelectedChatId(null)} 
            />
          )}
        </div>
      </div>
    </div>
  )
}
