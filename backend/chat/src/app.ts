import express from 'express';
import cors from 'cors';
import { PORT } from './config/config';
import chatRoutes from './routes/chatRoutes';
import documentRoutes from './routes/documentRoutes';
import { logRequestsMiddleware } from './middlewares/logMiddleware';
import { logger } from './utils/logger';

const app = express();

// Middleware
const allowedOrigins = [
  'https://nutrichat-ten.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(logRequestsMiddleware);

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Se não houver origin (ex: chamadas diretas), permite
    if (!origin) return callback(null, true);
    
    const isAllowed = allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production';
    
    if (isAllowed) {
      callback(null, true);
    } else {
      logger.warn(`CORS bloqueado para origem: ${origin}`);
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'Origin'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// Health check
app.get('/health', (req: any, res: any) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/chats', chatRoutes);
app.use('/api/documents', documentRoutes);

// Error handling
app.use((err: any, req: any, res: any, next: any) => {
  logger.error(`Erro não tratado: ${err.message}`);
  res.status(500).json({ detail: 'Erro interno do servidor' });
});

// Server startup
app.listen(PORT, () => {
  logger.info(`🚀 Servidor rodando em http://0.0.0.0:${PORT}`);
});

export default app;

