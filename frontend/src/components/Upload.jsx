import React, { useState } from 'react'
import { uploadFile } from '../services/chatApi'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return setStatus('Nenhum arquivo selecionado')
    setStatus('')
    setLoading(true)
    try {
      await uploadFile(file)
      setStatus('Arquivo enviado com sucesso. O assistente agora usa este documento.')
      setFile(null)
    } catch (err) {
      setStatus('Erro ao enviar arquivo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleUpload}>
      <div className="mb-3">
        <label htmlFor="fileInput" className="form-label">Selecione um arquivo (PDF, DOCX ou TXT)</label>
        <input 
          type="file" 
          className="form-control"
          id="fileInput"
          accept=".pdf,.docx,.txt" 
          onChange={(e) => setFile(e.target.files?.[0])}
        />
      </div>
      <button 
        type="submit" 
        className="btn btn-success w-100"
        disabled={loading || !file}
      >
        {loading ? 'Enviando...' : '📤 Enviar Plano'}
      </button>
      {status && (
        <div className={`alert ${status.includes('sucesso') ? 'alert-success' : 'alert-danger'} mt-3`} role="alert">
          {status}
        </div>
      )}
    </form>
  )
}
