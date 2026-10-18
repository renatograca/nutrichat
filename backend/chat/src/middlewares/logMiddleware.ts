import { log } from 'node:console';
import { logger } from '../utils/logger.js';

const logRequestsMiddleware = (req: any, res: any, next: any) => {
  logger.info(`📥 ${req.method} ${req.originalUrl} - Origin: ${req.get('origin') || 'no-origin'}`);

  if (req.method === 'OPTIONS') {
    res.on('finish', () => {
      logger.info(`📤 ${res.statusCode} ${req.originalUrl} (OPTIONS)`);
    });
    return next();
  }

  res.on('finish', () => {
    logger.info(`📤 ${res.statusCode} ${req.originalUrl}`);
  });

  next();
};

const verifyAccess = (req: any, res: any, next: any) => {
  const { user_id, phone, auth_by_phone } = req.query;

  if (!auth_by_phone && !user_id) {
    logger.error('auth_by_phone não está presente, mas user_id não foi fornecido');
    return (req: any, res: any) => res.status(400).json({ detail: 'user_id é obrigatório' });
  }

  if (auth_by_phone && !phone) {
    logger.error('auth_by_phone está presente, mas phone não foi fornecido');
    return(req: any, res: any) => res.status(400).json({ detail: 'phone é obrigatório' });
  }
    next();
}

export { logRequestsMiddleware, verifyAccess };

