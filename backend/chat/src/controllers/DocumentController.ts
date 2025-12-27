import { ingestPdf } from '../services/DocumentService';
import ChatRepository from '../repositories/ChatRepository';
import { logger } from '../utils/logger';

const chatRepository = new ChatRepository();

export const ingestDocument = async (req: any, res: any) => {
  try {
    const file = req.file;
    const { user_id, chat_id } = req.body;
    const userId = Number(user_id);

    logger.info(`Iniciando ingestão de documento: filename=${file?.originalname}, user_id=${userId}, chat_id=${chat_id}`);

    if (!file) {
      return res
        .status(400)
        .json({ detail: 'Nenhum arquivo foi enviado' });
    }

    if (!file.originalname.toLowerCase().endsWith('.pdf')) {
      return res.status(200).json({
        message: 'Por favor, envie um PDF válido.',
        chunks_count: 0,
        user_id: userId,
        document_id: null,
      });
    }

    const result = await ingestPdf(file.buffer, file.originalname, userId, chat_id);

    // Se foi passado chat_id, associar o documento ao chat
    if (chat_id) {
      const chat = await chatRepository.getChat(chat_id);
      if (!chat) {
        logger.warn(`Tentativa de ingestão para chat inexistente: ${chat_id}`);
        return res
          .status(404)
          .json({
            detail: 'Chat não encontrado',
          });
      }
      
      if (chat.user_id !== userId) {
        logger.warn(`Usuário ${userId} tentou associar documento ao chat ${chat_id} que pertence a outro usuário`);
        return res
          .status(403)
          .json({
            detail: 'O chat informado não pertence a este usuário',
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

