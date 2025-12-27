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

export { logRequestsMiddleware };

