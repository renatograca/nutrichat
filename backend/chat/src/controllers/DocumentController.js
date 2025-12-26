import { ingestPdf } from '../services/DocumentService.js';
import ChatRepository from '../repositories/ChatRepository.js';
import { logger } from '../utils/logger.js';

const chatRepository = new ChatRepository();

export const ingestDocument = async (req, res) => {
  try {
    const file = req.file;
    const { user_id, chat_id } = req.body;

    if (!file) {
      return res
        .status(400)
        .json({ detail: 'Nenhum arquivo foi enviado' });
    }

    if (!file.originalname.toLowerCase().endsWith('.pdf')) {
      return res.status(200).json({
        message: 'Por favor, envie um PDF válido.',
        chunks_count: 0,
        user_id,
        document_id: null,
      });
    }

    const result = await ingestPdf(file.buffer, file.originalname, user_id, chat_id);

    // Se foi passado chat_id, associar o documento ao chat
    if (chat_id) {
      const chat = await chatRepository.getChat(chat_id);
      if (!chat || chat.user_id !== user_id) {
        return res
          .status(404)
          .json({
            detail: 'Chat não encontrado ou não pertence ao usuário',
          });
      }
      // Associação
      await chatRepository.updateChatDocument(chat_id, result.document_id);
    }

    res.json(result);
  } catch (error) {
    logger.error(`Erro ao ingerir documento: ${error.message}`);
    res.status(400).json({ detail: error.message });
  }
};
