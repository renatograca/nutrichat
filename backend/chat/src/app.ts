import express from 'express';
import cors from 'cors';
import { PORT } from './config/config';
import chatRoutes from './routes/chatRoutes';
import documentRoutes from './routes/documentRoutes';
import { logRequestsMiddleware } from './middlewares/logMiddleware';
import { logger } from './utils/logger';

const app = express();

app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://nutrichat-ten.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
  ];

  const isVercelPreview = origin && origin.includes('vercel.app') && origin.includes('nutrichat');
  const isAllowed = !origin || allowedOrigins.includes(origin) || isVercelPreview || process.env.NODE_ENV !== 'production';

  if (isAllowed && origin) {
    res.header('Access-Control-Allow-Origin', origin);
  } else if (!origin) {
    res.header('Access-Control-Allow-Origin', '*');
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept, Origin, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  next();
});

app.use(cors({
  origin: true,
  credentials: true
}));

app.use(logRequestsMiddleware);
app.use(express.json());

app.get('/health', (req: any, res: any) => {
  res.json({ status: 'ok' });
});

app.use('/api/chats', chatRoutes);
app.use('/api/documents', documentRoutes);

app.use((err: any, req: any, res: any, next: any) => {
  if (res.headersSent) {
    return next(err);
  }
  logger.error(`Erro não tratado: ${err.message}`);
  res.status(500).json({ detail: 'Erro interno do servidor' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    logger.info(`🚀 Servidor rodando em http://0.0.0.0:${PORT}`);
  });
}

export default app;