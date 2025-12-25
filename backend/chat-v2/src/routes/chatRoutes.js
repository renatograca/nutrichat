import express from 'express';
import ChatRepository from '../repositories/ChatRepository.js';
import { askQuestion } from '../services/ChatService.js';
import { logger } from '../utils/logger.js';

const router = express.Router();
const chatRepository = new ChatRepository();

// POST /api/chats - Create a new chat
router.post('/', async (req, res) => {
  try {
    const { user_id, title } = req.body;
    const userId = user_id || 'default_user';

    const chatId = await chatRepository.createChat(userId, title || null);
    const chat = await chatRepository.getChat(chatId);

    res.status(201).json(chat);
  } catch (error) {
    logger.error(`Erro ao criar chat: ${error.message}`);
    res.status(400).json({ detail: error.message });
  }
});

// POST /api/chats/{chatId}/document - Associate a document to a chat
router.post('/:chatId/document', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { document_id, user_id } = req.body;

    if (!document_id) {
      return res.status(400).json({ detail: 'documentId é obrigatório' });
    }

    const chat = await chatRepository.getChat(chatId);
    if (!chat || chat.user_id !== user_id) {
      return res.status(404).json({ detail: 'Chat não encontrado' });
    }

    await chatRepository.updateChatDocument(chatId, document_id);
    res.json({ message: 'Documento associado com sucesso' });
  } catch (error) {
    logger.error(`Erro ao associar documento: ${error.message}`);
    res.status(400).json({ detail: error.message });
  }
});

// PATCH /api/chats/{chatId} - Update chat title
router.patch('/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title, user_id } = req.body;

    const chat = await chatRepository.getChat(chatId);
    if (!chat || chat.user_id !== user_id) {
      return res.status(404).json({ detail: 'Chat não encontrado' });
    }

    if (title) {
      await chatRepository.updateChatTitle(chatId, title);
    }

    res.json({ message: 'Chat atualizado com sucesso' });
  } catch (error) {
    logger.error(`Erro ao atualizar chat: ${error.message}`);
    res.status(400).json({ detail: error.message });
  }
});

// GET /api/chats - List user chats
router.get('/', async (req, res) => {
  try {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(404).json({ detail: 'user_id is empty' });
    }

    const chats = await chatRepository.getUserChats(user_id);
    res.json(chats);
  } catch (error) {
    logger.error(`Erro ao listar chats: ${error.message}`);
    res.json([]);
  }
});

// GET /api/chats/{chatId} - Get chat by ID
router.get('/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ detail: 'user_id é obrigatório' });
    }

    const chat = await chatRepository.getChat(chatId);
    if (!chat || chat.user_id !== user_id) {
      return res.status(404).json({ detail: 'Chat não encontrado' });
    }

    res.json(chat);
  } catch (error) {
    logger.error(`Erro ao buscar chat: ${error.message}`);
    res.status(400).json({ detail: error.message });
  }
});

// GET /api/chats/{chatId}/messages - Get chat messages
router.get('/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ detail: 'user_id é obrigatório' });
    }

    const chat = await chatRepository.getChat(chatId);
    if (!chat || chat.user_id !== user_id) {
      return res.status(404).json({ detail: 'Chat não encontrado' });
    }

    const messages = await chatRepository.getChatMessages(chatId);
    res.json(messages);
  } catch (error) {
    logger.error(`Erro ao buscar mensagens: ${error.message}`);
    res.status(400).json({ detail: error.message });
  }
});

// POST /api/chats/{chatId}/messages - Send a message
router.post('/:chatId/messages', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { message, user_id } = req.body;

    const chat = await chatRepository.getChat(chatId);
    if (!chat || chat.user_id !== user_id) {
      return res.status(404).json({ detail: 'Chat não encontrado' });
    }

    // Validação RAG: Só processa se houver documento associado
    if (!chat.document_id) {
      return res
        .status(400)
        .json({ detail: 'Chat não possui documento associado' });
    }

    // 1. Salvar mensagem do usuário
    await chatRepository.addMessage(chatId, 'USER', message);

    // 2. Obter resposta do RAG
    const resposta = await askQuestion(message, user_id, chatId);

    // 3. Salvar mensagem do assistente
    await chatRepository.addMessage(chatId, 'ASSISTANT', resposta);

    res.json({
      pergunta: message,
      text: resposta,
      user_id,
      role: 'ASSISTANT',
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    logger.error(`Erro ao enviar mensagem: ${error.message}`);
    res.status(400).json({ detail: error.message });
  }
});

// DELETE /api/chats/{chatId} - Delete a chat
router.delete('/:chatId', async (req, res) => {
  try {
    const { chatId } = req.params;
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ detail: 'user_id é obrigatório' });
    }

    const chat = await chatRepository.getChat(chatId);
    if (!chat || chat.user_id !== user_id) {
      return res.status(404).json({ detail: 'Chat não encontrado' });
    }

    await chatRepository.deleteChat(chatId);
    res.json({ message: 'Chat deletado com sucesso' });
  } catch (error) {
    logger.error(`Erro ao deletar chat: ${error.message}`);
    res.status(400).json({ detail: error.message });
  }
});

export default router;
