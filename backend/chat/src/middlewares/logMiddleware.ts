import { logger } from '../utils/logger';

const logRequestsMiddleware = (req: any, res: any, next: any) => {
  logger.info(`📥 ${req.method} ${req.originalUrl}`);

  res.on('finish', () => {
    logger.info(`📤 ${res.statusCode} ${req.originalUrl}`);
  });

  next();
};

export { logRequestsMiddleware };

