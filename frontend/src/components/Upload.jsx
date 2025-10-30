import React, {useState} from 'react'
import { BASE_URL } from '../config'

export default function Upload({ onReady }){
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('Nenhum arquivo selecionado')
  const [docId, setDocId] = useState(null)

  async function handleUpload(e){
    e.preventDefault()
    if(!file) return alert('Escolha um arquivo primeiro.')
    setStatus('Enviando...')
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch((BASE_URL || '') + '/api/documents/upload', {
        method: 'POST',
        body: fd
      })
      const data = await res.json()
      setDocId(data.documentId)
      setStatus('Indexando... (simulado)')
      // In the mock backend indexing is immediate; in real app poll /status
      setTimeout(() => {
        setStatus('Pronto para consulta')
        onReady && onReady(data.documentId)
      }, 1200)
    } catch (err){
      console.error(err)
      setStatus('Erro no upload')
    }
  }

  return (
    <div className="card">
      <h2>Upload do Plano Nutricional</h2>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".pdf,.docx,.txt" onChange={e => setFile(e.target.files[0])} />
        <button type="submit">Enviar</button>
      </form>
      <div className="status">
        <strong>Status:</strong> {status}
      </div>
      {docId && <div className="docid">Document ID: <code>{docId}</code></div>}
    </div>
  )
}
