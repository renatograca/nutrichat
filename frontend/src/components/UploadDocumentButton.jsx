import React, { useRef, useState } from 'react'
import { uploadFile } from '../services/chatApi'

export default function UploadDocumentButton({ chatId, onUploadSuccess }) {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setUploading(true)
      // 1. Upload do arquivo
      await uploadFile(file, chatId)
      
      onUploadSuccess()
    } catch (err) {
      console.error('Erro no upload:', err)
      alert('Erro ao processar o documento. Verifique o formato e tente novamente.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="text-center p-4">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
        accept=".pdf"
      />
      
      <div className="card border-primary border-dashed p-5 bg-light rounded-4">
        <div className="mb-3">
          <i className="bi bi-file-earmark-arrow-up text-primary" style={{ fontSize: '3rem' }}></i>
        </div>
        <h4>Inserir plano alimentar</h4>
        <p className="text-muted mb-4">Envie seu plano alimentar para começar a conversar com a IA.</p>
        
        <button 
          className="btn btn-primary btn-lg rounded-pill px-5 py-3 shadow-sm fw-bold"
          onClick={() => fileInputRef.current.click()}
          disabled={uploading}
        >
          {uploading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Enviando...
            </>
          ) : (
            'Selecionar Arquivo'
          )}
        </button>
        <div className="mt-3 small text-muted">Formato aceito: PDF</div>
      </div>
    </div>
  )
}
