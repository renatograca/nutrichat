import express from 'express';
import * as ChatController from '../controllers/ChatController.js';

const router = express.Router();

// POST /api/chats - Create a new chat
router.post('/', ChatController.createChat);

// POST /api/chats/{chatId}/document - Associate a document to a chat
router.post('/:chatId/document', ChatController.associateDocument);

// PATCH /api/chats/{chatId} - Update chat title
router.patch('/:chatId', ChatController.updateChat);

// GET /api/chats - List user chats
router.get('/', ChatController.listChats);

// GET /api/chats/{chatId} - Get chat by ID
router.get('/:chatId', ChatController.getChat);

// GET /api/chats/{chatId}/messages - Get chat messages
router.get('/:chatId/messages', ChatController.getChatMessages);

// POST /api/chats/{chatId}/messages - Send a message
router.post('/:chatId/messages', ChatController.sendMessage);

// DELETE /api/chats/{chatId} - Delete a chat
router.delete('/:chatId', ChatController.deleteChat);

export default router;

