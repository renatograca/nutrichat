import express from 'express';
import cors from 'cors';
import { PORT } from './config/config.js';
import chatRoutes from './routes/chatRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import { logRequestsMiddleware } from './middlewares/logMiddleware.js';
import { logger } from './utils/logger.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(logRequestsMiddleware);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/chats', chatRoutes);
app.use('/api/documents', documentRoutes);

// Error handling
app.use((err, req, res, next) => {
  logger.error(`Erro não tratado: ${err.message}`);
  res.status(500).json({ detail: 'Erro interno do servidor' });
});

// Server startup
app.listen(PORT, () => {
  logger.info(`🚀 Servidor rodando em http://0.0.0.0:${PORT}`);
});

export default app;
