import { ingestPdf } from '../services/DocumentService.js';
import ChatRepository from '../repositories/ChatRepository.js';
import { logger } from '../utils/logger.js';
import { getId, validationAccessToChat } from '../utils/ValidationsUtils.js';

const chatRepository = new ChatRepository();

export const ingestDocument = async (req: any, res: any) => {
  try {
    const file = req.file;
    const { user_id, chat_id } = req.body;
    const { phone, auth_by_phone } = req.query;
    const id = getId(auth_by_phone, Number(user_id), phone);

    if (!file) {
      return res
        .status(400)
        .json({ detail: 'Nenhum arquivo foi enviado' });
    }

    if (!file.originalname.toLowerCase().endsWith('.pdf')) {
      return res.status(400).json({
        message: 'Por favor, envie um PDF válido.',
        chunks_count: 0,
        user_id: id,
        document_id: null,
      });
    }

    const result = await ingestPdf(file.buffer, file.originalname, id, chat_id);

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

      if (validationAccessToChat(auth_by_phone, id, phone, chat)) {
        logger.warn(`Usuário ${id} tentou associar documento ao chat ${chat_id} que pertence a outro usuário`);
        return res
          .status(403)
          .json({
            detail: 'O chat informado não pertence a este usuário',
          });
      }
      await chatRepository.updateChatDocument(chat_id, result.document_id);
    }

    res.json(result);
  } catch (error: any) {
    logger.error(`Erro ao ingerir documento: ${error.message}`);
    res.status(400).json({ detail: error.message });
  }
};