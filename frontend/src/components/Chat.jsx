import React, { useState, useRef, useEffect } from 'react'

// Mock de configuração. O documentId é mockado para habilitar o chat.
const BASE_URL = 'http://localhost:8080'
const MOCK_DOCUMENT_ID = "mock-plan-123" 

// --- Ícones SVG ---
const MenuIcon = (props) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const ProfileIcon = (props) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2"/>
    <path d="M20 21a8 8 0 10-16 0" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const SendIcon = (props) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const PlusIcon = (props) => (
  <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4v16m-8-8h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

// --- Componente Chat Principal ---
export default function Chat({ documentId }) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([
    // Simulação de mensagens para preencher a tela
    { role: 'bot', text: '✅ Enviando "nutri.pdf"...', status: 'success' },
    { role: 'bot', text: '❌ Erro ao enviar o arquivo.', status: 'error' },
    { role: 'user', text: 'tudo bem, ta começando a melhorar' },
    { role: 'bot', text: '❌ Erro ao consultar o backend.', status: 'error' },
    { role: 'user', text: 'alguma coisa' },
    { role: 'bot', text: '❌ Erro ao consultar o backend: Failed to fetch', status: 'error' },
  ])
  const [loading, setLoading] = useState(false)
  const chatWindowRef = useRef(null)

  // Scrolla para o final
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
    }
  }, [messages])
  
  // Mock function para simular a resposta da IA
  async function simulateChatResponse(q) {
    return new Promise(resolve => {
        setTimeout(() => {
            const botMsg = { 
                role: 'bot', 
                text: `Com base na sua pergunta, eu recomendaria...`, 
            }
            resolve(botMsg)
        }, 1500) 
    })
  }

  async function sendQuestion(e) {
    e && e.preventDefault()
    if (!documentId) return alert('Envie um plano nutricional primeiro.')
    if (!question.trim()) return

    const userQuestion = question
    const userMsg = { role: 'user', text: userQuestion }
    
    setMessages(prev => [...prev, userMsg])
    setQuestion('')
    setLoading(true)

    try {
        const botMsg = await simulateChatResponse(userQuestion)
        setMessages(prev => [...prev, botMsg])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'bot', text: 'Erro ao consultar o assistente.', status: 'error' }])
    } finally {
      setLoading(false)
    }
  }

  // Estilização das mensagens
  const Message = ({ m }) => {
    const isUser = m.role === 'user'
    
    // Define cores e estilos conforme a imagem anexada
    let bubbleClasses = 'p-3 rounded-xl max-w-xs shadow-sm text-sm break-words'
    let textClasses = 'text-white'
    let avatarIcon = isUser ? '👤' : (m.status === 'error' ? '❌' : '🌿') 
    let avatarBg = isUser ? 'bg-gray-100 text-gray-700' : (m.status === 'error' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600')

    if (isUser) {
        bubbleClasses += ' bg-blue-600 rounded-tr-none ml-auto mr-0'
        textClasses = 'text-white'
    } else if (m.status === 'error') {
        bubbleClasses += ' bg-red-500 rounded-tl-none mr-auto ml-0'
        textClasses = 'text-white'
    } else { // Bot ou Status Success
        bubbleClasses += ' bg-green-500 rounded-tl-none mr-auto ml-0'
        textClasses = 'text-white'
    }

    return (
      <div className={`flex mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`flex items-start gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Avatar (lado de fora do balão, como na imagem) */}
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1 font-semibold ${avatarBg}`}>
            {avatarIcon}
          </div>
          {/* Balão de Mensagem */}
          <div className={bubbleClasses}>
            <div className={textClasses}>{m.text}</div>
          </div>
        </div>
      </div>
    )
  }
  
  // Indicador de digitação
  const TypingIndicator = () => (
    <div className="flex space-x-1">
        <div className="h-2 w-2 bg-gray-50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="h-2 w-2 bg-gray-50 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
        <div className="h-2 w-2 bg-gray-50 rounded-full animate-bounce" style={{ animationDelay: '400ms' }}></div>
    </div>
  )

  return (
    <div className="flex flex-col h-full w-full bg-gray-50">
      
      {/* HEADER (Cores e layout do mockup) */}
      <header className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg flex-shrink-0">
        <button className="p-2 -ml-2 rounded-full hover:bg-white/20 transition duration-150">
          <MenuIcon className="w-6 h-6"/>
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold tracking-tight">NutriChat</h1>
          <span className="text-sm font-light opacity-90">Seu assistente de plano alimentar</span>
        </div>
        <button className="p-2 -mr-2 rounded-full hover:bg-white/20 transition duration-150">
          <ProfileIcon className="w-6 h-6"/>
        </button>
      </header>

      {/* JANELA DE MENSAGENS */}
      <div ref={chatWindowRef} className="flex-grow overflow-y-auto p-4 custom-scrollbar bg-gray-50">
        {messages.map((m, i) => (
          <Message key={i} m={m} />
        ))}
        
        {loading && (
          <div className="flex justify-start mb-3">
            <div className="flex items-start gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1 bg-green-100 text-green-600">
                {'🌿'}
              </div>
              <div className="p-3 rounded-xl bg-green-500 rounded-bl-none shadow-sm">
                <TypingIndicator />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* INPUT DO CHAT (Cores e layout do mockup) */}
      <form onSubmit={sendQuestion} className="p-4 bg-white border-t border-gray-100 flex items-center gap-2 shadow-inner flex-shrink-0">
        
        {/* Botão + (Adicionar) */}
        <button
          type="button"
          className="w-12 h-12 flex items-center justify-center rounded-full text-white transition duration-150 shadow-md bg-blue-600 hover:bg-blue-700"
        >
          <PlusIcon className="w-6 h-6"/>
        </button>
        
        {/* Input */}
        <input
          type="text"
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Digite sua pergunta..."
          disabled={loading}
          className="flex-grow p-3 border border-gray-200 rounded-full focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition duration-150 disabled:bg-gray-50 disabled:text-gray-400"
        />
        
        {/* Botão "Escolher arquivo..." (Simulação de um segundo botão à direita, como na imagem) */}
        <button 
          type="button" 
          className="px-4 h-12 font-medium text-sm text-gray-500 bg-gray-100 rounded-full border border-gray-300 hover:bg-gray-200 transition duration-150"
        >
          Escolher arquivo nutri
        </button>
      </form>
    </div>
  )
}