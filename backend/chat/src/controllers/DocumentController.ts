import { ingestPdf } from '../services/DocumentService';
import ChatRepository from '../repositories/ChatRepository';
import { logger } from '../utils/logger';

const chatRepository = new ChatRepository();

export const ingestDocument = async (req: any, res: any) => {
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
  } catch (error: any) {
    logger.error(`Erro ao ingerir documento: ${error.message}`);
    res.status(400).json({ detail: error.message });
  }
};

