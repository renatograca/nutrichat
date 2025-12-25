import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ENV = process.env.ENV || 'local';

if (ENV === 'local') {
  dotenv.config({ path: path.join(__dirname, '../../.env') });
}

const DATABASE_URL = process.env.DATABASE_URL || (() => {
  const DB_HOST = process.env.DB_HOST || 'localhost';
  const DB_USER = process.env.DB_USER || 'postgres';
  const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
  const DB_NAME = process.env.DB_NAME || 'nutri';
  const DB_PORT = process.env.DB_PORT || '5432';
  return `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
})();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || null;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || null;

const PORT = parseInt(process.env.PORT || '8080', 10);

export {
  DATABASE_URL,
  OPENAI_API_KEY,
  GOOGLE_API_KEY,
  PORT,
  ENV,
};
