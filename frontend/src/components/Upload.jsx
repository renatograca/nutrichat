import React, { useState } from 'react'
import { uploadFile } from '../services/api'

export default function Upload() {
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return setStatus('Nenhum arquivo selecionado')
    setStatus('Enviando...')
    try {
      await uploadFile(file)
      setStatus('Arquivo enviado com sucesso. O assistente agora usa este documento.')
    } catch (err) {
      setStatus('Erro ao enviar arquivo.')
    }
  }

  return (
    <section className="upload">
      <form onSubmit={handleUpload}>
        <label className="file-label">
          <input type="file" accept=".pdf,.docx,.txt" onChange={(e) => setFile(e.target.files?.[0])} />
        </label>
        <button type="submit">Enviar plano</button>
      </form>
      {status && <div className="upload-status">{status}</div>}
    </section>
  )
}
