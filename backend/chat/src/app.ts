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
  'nutrichat-frontend.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem origin (como mobile apps ou curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.options('*', cors()); // Responde explicitamente a todas as requisições OPTIONS
app.use(express.json());
app.use(logRequestsMiddleware);

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

