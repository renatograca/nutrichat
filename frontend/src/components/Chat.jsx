import React, { useState, useRef, useEffect } from 'react'
import { sendMessage, uploadFile } from '../services/chat'

export default function Chat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Refs para controle de scroll e altura do textarea
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)
  const fileInputRef = useRef(null)

  // Função para rolar até o final da conversa
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Executa o scroll sempre que a lista de mensagens muda ou o loading inicia/para
  useEffect(() => {
    scrollToBottom()
  }, [messages, loading])

  // Ajusta a altura do textarea automaticamente conforme o conteúdo cresce
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleSend = async (e) => {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const userText = input.trim()
    const userMsg = { role: 'user', text: userText }

    // Limpa o input e adiciona a mensagem do usuário
    setInput('')
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      // Chama o serviço real do RAG
      const reply = await sendMessage(userText)
      
      const assistantMsg = { 
        role: 'assistant', 
        text: reply || 'Desculpe, não consegui processar sua solicitação.' 
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch (error) {
      console.error('Erro no chat:', error)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: '<strong>Erro de Conexão:</strong> Não foi possível falar com o nutricionista. Verifique sua internet.' 
      }])
    } finally {
      setLoading(false)
    }
  }

  // Atalho: Enter envia, Shift+Enter pula linha
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const fileName = file.name
    
    // Adiciona mensagem sistêmica de upload
    setMessages(prev => [...prev, { 
      role: 'assistant', 
      text: `<i class="bi bi-file-earmark-arrow-up"></i> Enviando plano: <strong>${fileName}</strong>...` 
    }])

    try {
      await uploadFile(file)
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: `<i class="bi bi-check-circle-fill text-success"></i> Plano <strong>${fileName}</strong> processado com sucesso! Agora você pode me fazer perguntas sobre ele.` 
      }])
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: `<i class="bi bi-exclamation-triangle-fill text-danger"></i> Erro ao processar <strong>${fileName}</strong>. Tente novamente.` 
      }])
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="d-flex flex-column h-100 bg-light shadow-sm" style={{ maxHeight: '100vh' }}>
      
      {/* --- Área de Mensagens --- */}
      <div className="flex-grow-1 overflow-auto p-3 p-md-4" style={{ scrollBehavior: 'smooth' }}>
        
        {/* Empty State: Exibe quando não há mensagens */}
        {messages.length === 0 && (
          <div className="text-center text-muted my-auto py-5 fade-in">
            <div className="bg-white rounded-circle d-inline-flex p-4 shadow-sm mb-3">
               <i className="bi bi-robot text-primary" style={{ fontSize: '3rem' }}></i>
            </div>
            <h4 className="fw-bold text-dark">Olá! Sou seu NutriSmart.</h4>
            <p className="px-4">Como posso ajudar na sua jornada de saúde hoje? <br/> Tente: "Dicas para um jantar leve"</p>
            
            <div className="mt-4">
              <button 
                className="btn btn-outline-primary rounded-pill px-4"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                {uploading ? (
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                ) : (
                  <i className="bi bi-file-earmark-plus me-2"></i>
                )}
                Adicionar Plano Nutricional
              </button>
            </div>
          </div>
        )}

        {/* Lista de Mensagens */}
        {messages.map((m, i) => (
          <div key={i} className={`d-flex mb-4 fade-in ${m.role === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
            
            {/* Avatar do Bot (só aparece para o assistente) */}
            {m.role === 'assistant' && (
              <div className="me-2 align-self-start"> 
                <div className="bg-primary bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px' }}>
                  <i className="bi bi-robot"></i>
                </div>
              </div>
            )}

            {/* Bolha de Texto */}
            <div 
              className={`p-3 rounded-3 shadow-sm ${
                m.role === 'user' 
                  ? 'bg-primary text-white' 
                  : 'bg-white border text-dark'
              }`}
              style={{ maxWidth: '85%', wordBreak: 'break-word' }}
            >
              {/* Renderização segura de HTML básico retornado pelo RAG */}
               <div className="mb-0" dangerouslySetInnerHTML={{ __html: m.text }} />
            </div>
          </div>
        ))}

        {/* Indicador de "Digitando..." (Loading State) */}
        {loading && (
          <div className="d-flex justify-content-start mb-3 fade-in">
             <div className="me-2 align-self-start"> 
                <div className="bg-primary bg-gradient text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '36px', height: '36px' }}>
                  <i className="bi bi-three-dots animation-pulse"></i>
                </div>
              </div>
            <div className="bg-white border p-3 rounded-3 shadow-sm d-flex align-items-center">
              <div className="spinner-grow spinner-grow-sm text-primary me-2" role="status" style={{animationDuration: '0.8s'}}></div>
              <span className="text-muted small fst-italic">Consultando nutricionista IA...</span>
            </div>
          </div>
        )}
        
        {/* Elemento invisível para marcar o fim do chat para o auto-scroll */}
        <div ref={bottomRef} style={{ height: '1px' }} />
      </div>
      
      {/* --- Área de Input (Fica naturalmente no rodapé devido ao flex-column) --- */}
      <div className="bg-white border-top p-3 py-4 shadow-sm-top">
        <div className="container-fluid max-width-lg mx-auto">
          <div className="row justify-content-center">
            <div className="col-12 col-lg-10">
              <form onSubmit={handleSend}>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="d-none" 
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileUpload}
                />
                <div className="input-group shadow-sm rounded-pill overflow-hidden border">
                  {/* Botão de Upload na barra */}
                  <button 
                    type="button" 
                    className="btn btn-light border-0 px-3 text-muted"
                    onClick={() => fileInputRef.current?.click()}
                    title="Anexar plano nutricional"
                    disabled={uploading || loading}
                  >
                    <i className="bi bi-paperclip fs-5"></i>
                  </button>

                  {/* Textarea para múltiplas linhas */}
                  <textarea
                    ref={textareaRef}
                    className="form-control border-0 py-3 ps-2 bg-light"
                    aria-label="mensagem"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Digite sua dúvida nutricional..."
                    rows={1}
                    // Define altura máxima e scroll se o texto for muito longo
                    style={{ resize: 'none', maxHeight: '120px', overflowY: 'auto' }}
                    disabled={loading}
                  />
                  {/* Botão de Enviar com estado de loading */}
                  <button 
                    type="submit" 
                    className={`btn btn-primary px-4 border-0 d-flex align-items-center justify-content-center ${loading || !input.trim() ? 'disabled' : ''}`}
                    disabled={!input.trim() || loading}
                    title="Enviar mensagem"
                    style={{ transition: 'all 0.2s' }}
                  >
                    {loading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                        <i className="bi bi-send-fill fs-5"></i>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
