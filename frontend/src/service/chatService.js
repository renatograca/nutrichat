const BASE_URL = 'http://localhost:8080'

// Helper para garantir que os logs apareçam no terminal
const logger = {
    log: (...args) => {
        console.log('\x1b[0m', ...args) // Reset color
    },
    info: (...args) => {
        console.info('\x1b[36m', ...args) // Cyan
    },
    warn: (...args) => {
        console.warn('\x1b[33m', ...args) // Yellow
    },
    error: (...args) => {
        console.error('\x1b[31m', ...args) // Red
    },
    success: (...args) => {
        console.log('\x1b[32m', ...args) // Green
    }
}

/**
 * Envia um arquivo para o backend
 * @param {File} file - O arquivo a ser enviado
 * @returns {Promise<{documentId: string}>}
 */
export async function uploadDocument(file) {
    try {
        logger.info('📤 Iniciando upload do arquivo:', {
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type
        })

        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch(`${BASE_URL}/api/documents/upload`, {
            method: 'POST',
            body: formData
        })

        if (!response.ok) {
            const errorText = await response.text()
            logger.error('❌ Erro no upload:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            })
            throw new Error(`Erro ${response.status}: ${errorText}`)
        }

        const data = await response.json()
        logger.success('✅ Upload concluído com sucesso:', {
            documentId: data.documentId
        })

        return data
    } catch (error) {
        logger.error('❌ Erro detalhado no upload:', {
            message: error.message,
            stack: error.stack
        })
        throw error
    }
}

/**
 * Envia uma pergunta para o chatbot
 * @param {string} documentId - ID do documento de referência
 * @param {string} question - Pergunta do usuário
 * @returns {Promise<{answer: string, sources: string[]}>}
 */
export async function sendQuestion(documentId, question) {
    try {
        logger.info('💬 Enviando pergunta:', {
            documentId,
            question: question.substring(0, 50) + (question.length > 50 ? '...' : '')
        })

        const response = await fetch(`${BASE_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                documentId,
                question
            })
        })

        if (!response.ok) {
            const errorText = await response.text()
            logger.error('❌ Erro na resposta:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            })
            throw new Error(`Erro ${response.status}: ${errorText}`)
        }

        const data = await response.json()
        logger.success('✅ Resposta recebida:', {
            answer: data.answer.substring(0, 50) + (data.answer.length > 50 ? '...' : ''),
            sourcesCount: data.sources?.length || 0
        })

        return data
    } catch (error) {
        logger.error('❌ Erro detalhado no chat:', {
            message: error.message,
            documentId,
            question: question.substring(0, 50) + (question.length > 50 ? '...' : ''),
            stack: error.stack
        })
        throw error
    }
}

/**
 * Verifica o status do servidor
 * @returns {Promise<boolean>}
 */
export async function checkServerStatus() {
    try {
        logger.info('🔍 Verificando status do servidor...')
        const response = await fetch(`${BASE_URL}/health`)
        
        if (response.ok) {
            logger.success('✅ Servidor está online')
        } else {
            logger.warn('⚠️ Servidor está offline')
        }
        
        return response.ok
    } catch (error) {
        logger.error('❌ Erro ao verificar status do servidor:', error)
        return false
    }
}
