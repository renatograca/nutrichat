import React, { useState, useRef, useEffect } from 'react'
import { uploadDocument, sendQuestion as sendChatQuestion } from '../service/chatService'

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

// Ícone de Avião/Envio (Mantido, mas agora é usado no botão de envio)
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
export default function Chat() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [documentId, setDocumentId] = useState(null)
  const chatWindowRef = useRef(null)
  const fileInputRef = useRef(null)
  const textAreaRef = useRef(null)

  // Função para ajustar altura do textarea
  const adjustTextAreaHeight = () => {
    const textarea = textAreaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = Math.min(textarea.scrollHeight, 128) + 'px'
    }
  }

  // Ajusta altura quando o conteúdo muda
  useEffect(() => {
    adjustTextAreaHeight()
  }, [question])

  // Scrolla para o final
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
    }
  }, [messages])
  
  async function handleFileUpload(file) {
    if (!file) return
    setLoading(true)
    setMessages(prev => [...prev, { 
      role: 'user', 
      text: `📄 Enviando "${file.name}"...` 
    }])

    try {
      const { documentId } = await uploadDocument(file)
      setDocumentId(documentId)
      setMessages(prev => [...prev, {
        role: 'bot',
        text: `✅ Documento "${file.name}" carregado com sucesso!`
      }])
    } catch (err) {
      console.error('Erro no upload:', err)
      setMessages(prev => [...prev, {
        role: 'bot',
        text: `❌ Erro ao enviar arquivo: ${err.message}`,
        status: 'error'
      }])
    } finally {
      setLoading(false)
    }
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
      const { answer, sources } = await sendChatQuestion(documentId, userQuestion)
      const botMsg = {
        role: 'bot',
        text: answer,
        sources
      }
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      console.error('Erro no chat:', err)
      setMessages(prev => [...prev, { 
        role: 'bot', 
        text: `Erro ao consultar o assistente: ${err.message}`, 
        status: 'error' 
      }])
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

      {/* INPUT DO CHAT (Estilo WhatsApp) */}
      <form 
        onSubmit={(e) => {
          e.preventDefault()
          if (question.trim()) sendQuestion()
        }} 
        className="p-3 bg-white border-t border-gray-100 shadow-inner flex-shrink-0"
      >
        <div className="max-w-4xl mx-auto flex items-end gap-2">
          {/* Área de upload com nome do arquivo */}
          <div className="relative min-w-[40px] h-[40px]">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file)
              }}
              ref={fileInputRef}
              disabled={loading}
            />
            <button
              type="button"
              className={`absolute inset-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                loading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
              }`}
              disabled={loading}
            >
              <PlusIcon className="w-5 h-5"/>
            </button>
            {/* Nome do arquivo selecionado */}
            <div className="absolute left-12 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
              {fileInputRef.current?.files?.[0]?.name || "Nenhum arquivo selecionado"}
            </div>
          </div>
          
          {/* Área de texto */}
          <div className="flex-grow relative bg-white rounded-2xl border border-gray-200 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400 transition-all">
            <textarea
              ref={textAreaRef}
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (question.trim()) sendQuestion()
                }
              }}
              placeholder="Digite sua pergunta... (Shift + Enter para nova linha)"
              disabled={loading}
              rows={1}
              className="block w-full px-4 py-3 max-h-32 text-gray-700 placeholder-gray-400 bg-transparent border-none rounded-2xl resize-none focus:ring-0 overflow-y-auto"
              style={{
                minHeight: '48px',
              }}
            />
          </div>
          
          {/* Botão de Envio */}
          <button 
            type="submit" 
            disabled={loading || !question.trim()}
            className={`mb-1 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              loading || !question.trim() 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
            }`}
          >
            <SendIcon className="w-5 h-5"/>
          </button>
        </div>
      </form>
    </div>
  )
}