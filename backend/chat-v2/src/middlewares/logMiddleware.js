import { logger } from '../utils/logger.js';

const logRequestsMiddleware = (req, res, next) => {
  logger.info(`📥 ${req.method} ${req.originalUrl}`);

  res.on('finish', () => {
    logger.info(`📤 ${res.statusCode} ${req.originalUrl}`);
  });

  next();
};

export { logRequestsMiddleware };
