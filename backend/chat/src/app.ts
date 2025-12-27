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
    if (!origin) return callback(null, true);

    const isVercelPreview = origin.includes('vercel.app') && origin.includes('nutrichat');
    const isAllowed = allowedOrigins.includes(origin) || isVercelPreview || process.env.NODE_ENV !== 'production';

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`CORS Bloqueado para: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.sendStatus(200);
  }
  next();
});

app.options('*', (req, res) => {
  res.sendStatus(200);
});

app.use(express.json());

// Health check
app.get('/health', (req: any, res: any) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/api/chats', chatRoutes);
app.use('/api/documents', documentRoutes);

// Error handling
app.use((err: any, req: any, res: any, _: any) => {
  logger.error(`Erro não tratado: ${err.message}`);
  res.status(500).json({ detail: 'Erro interno do servidor' });
});

// Server startup
app.listen(PORT, () => {
  logger.info(`🚀 Servidor rodando em http://0.0.0.0:${PORT}`);
});

export default app;

