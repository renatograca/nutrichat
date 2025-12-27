import React, { useRef, useState } from 'react'
import { uploadFile } from '../services/chatApi'

export default function UploadDocumentButton({ chatId, onUploadSuccess }) {
  const fileInputRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

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
      setErrorMessage('Erro ao processar o documento. Verifique se é um PDF válido e tente novamente.')
      setShowErrorModal(true)
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
          <div className="card border-0 shadow-lg position-relative text-start" style={{ maxWidth: '400px', width: '100%' }}>
            <div className="card-body p-4 text-center">
              <div className="mb-3">
                <i className="bi bi-exclamation-circle text-danger fs-1"></i>
              </div>
              <h5 className="card-title fw-bold mb-2">Falha no Upload</h5>
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
