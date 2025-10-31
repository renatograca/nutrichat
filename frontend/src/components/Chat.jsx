import { useState, useRef, useEffect } from 'react'
import { BASE_URL } from '../config'

const MenuIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const ProfileIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2"/>
    <path d="M20 21a8 8 0 10-16 0" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const AttachmentIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4v12m-4-4h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const SendIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

export default function Chat({ documentId }) {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [docId, setDocId] = useState(documentId)
  const fileInputRef = useRef(null)
  const chatWindowRef = useRef(null)

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight
    }
  }, [messages])

  async function handleFileUpload(file) {
    if (!file) return
    setLoading(true)
    setMessages(prev => [...prev, { role: 'user', text: `📄 Enviando "${file.name}"...` }])
    const fd = new FormData()
    fd.append('file', file)

    try {
      const res = await fetch((BASE_URL || '') + '/api/documents/upload', {
        method: 'POST',
        body: fd
      })
      const data = await res.json()
      setDocId(data.documentId)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', text: `✅ Documento "${file.name}" carregado com sucesso e indexado.` }
      ])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'assistant', text: '❌ Erro ao enviar o arquivo.' }])
    } finally {
      setLoading(false)
    }
  }

  async function sendQuestion(e) {
    e && e.preventDefault()
    if (!docId) return alert('Envie um plano nutricional primeiro.')
    if (!question.trim()) return

    const userMsg = { role: 'user', text: question }
    setMessages(prev => [...prev, userMsg])
    setQuestion('')
    setLoading(true)

    try {
      const res = await fetch((BASE_URL || '') + '/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId: docId, question })
      })
      const data = await res.json()
      const botMsg = { role: 'assistant', text: data.answer, sources: data.sources }
      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'assistant', text: 'Erro ao consultar o backend.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleFileSelect(e) {
    const file = e.target.files[0]
    if (file) handleFileUpload(file)
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
            <MenuIcon />
          </button>
          <div className="text-center">
            <h1 className="text-xl font-bold">NutriChat</h1>
            <span className="text-sm opacity-90">Seu assistente de plano alimentar</span>
          </div>
          <button className="p-2 rounded-full hover:bg-white/20 transition-colors">
            <ProfileIcon />
          </button>
        </div>
      </header>

      <div 
        ref={chatWindowRef}
        className="flex-1 overflow-y-auto px-4 py-6 bg-gray-50"
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault()
          const file = e.dataTransfer.files[0]
          if (file) handleFileUpload(file)
        }}
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-8 px-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🌿</span>
              </div>
              <h2 className="text-xl font-medium text-gray-700 mb-2">
                Bem-vindo ao NutriChat!
              </h2>
              <p className="text-gray-500">
                Envie seu plano nutricional para começar a conversar.
              </p>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''} ${m.role === 'user' ? 'ml-12' : 'mr-12'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                m.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
              }`}>
                {m.role === 'user' ? '👤' : '🌿'}
              </div>
              <div className={`relative px-4 py-3 rounded-2xl ${
                m.role === 'user' 
                  ? 'bg-blue-500 text-white rounded-br-sm' 
                  : 'bg-green-500 text-white rounded-bl-sm'
              }`}>
                <p className="whitespace-pre-wrap">{m.text}</p>
                {m.sources && m.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-white/20 text-sm">
                    <p className="font-medium">Fontes:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {m.sources.map((s, idx) => (
                        <code key={idx} className="px-1.5 py-0.5 rounded bg-black/20 text-xs">
                          {s.length > 30 ? s.substring(0, 30) + '...' : s}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3 mr-12">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                🌿
              </div>
              <div className="px-4 py-3 rounded-2xl bg-green-500 text-white rounded-bl-sm">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={sendQuestion} className="sticky bottom-0 bg-white border-t border-gray-200 shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
            <button
              type="button"
              className="text-gray-400 hover:text-blue-500 transition-colors"
              onClick={() => fileInputRef.current.click()}
            >
              <AttachmentIcon />
            </button>
            <input
              type="text"
              className="flex-1 bg-transparent border-none focus:ring-0 text-gray-700 placeholder-gray-400"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder={docId ? "Digite sua pergunta..." : "Envie um plano para começar..."}
              disabled={loading}
            />
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !question.trim() || !docId}
            className={`p-2 rounded-full transition-colors ${
              loading || !question.trim() || !docId
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-blue-500 hover:text-blue-600'
            }`}
          >
            <SendIcon />
          </button>
        </div>
      </form>
    </div>
  )
}