import {useState} from 'react'
import Chat from './components/Chat'

// --- Componente Principal (App) ---
export default function App(){
  // O documentId aqui precisaria vir de um componente de upload real
  // ou ser mockado para fins de demonstração do chat
  const [documentId, setDocumentId] = useState("mock-document-id-123") // Mock para habilitar o chat
  // Se quiser testar o estado inicial de "carregue o plano", mude para useState(null)

  return (
    <>
      {/* Adiciona o script do Tailwind e estilos globais */}
      <script src="https://cdn.tailwindcss.com"></script>
      <style>
        {`
          /* Custom Scrollbar for Chat Window (Optional but nice) */
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }

          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #cbd5e1; /* gray-300 */
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f1f1;
          }

          /* Animação para o Typing Indicator */
          @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-5px); }
          }
          .animate-bounce > div {
            animation: bounce 1s infinite ease-in-out;
          }
          .animate-bounce > div:nth-child(2) { animation-delay: 0.2s; }
          .animate-bounce > div:nth-child(3) { animation-delay: 0.4s; }
        `}
      </style>
      
      <div className="min-h-screen bg-gray-100 font-sans flex items-center justify-center p-4">
        {/* Simula o container do telefone, focando no chat */}
        <div className="relative w-full max-w-md h-[90vh] bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
          {/* Barra superior do telefone (mockup) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-xl z-20"></div>
          <div className="absolute top-2 right-4 w-8 h-2 rounded-full bg-gray-700 z-20"></div> {/* Simula câmera frontal */}

          {/* O Chat em si */}
          <Chat documentId={documentId} />
        </div>
      </div>
    </>
  )
}
