import pool from '../db/pool';
import { logger } from '../utils/logger';

class DocumentRepository {
  constructor() {
    this._ensureTable();
  }

  async _ensureTable() {
    const client = await pool.connect();
    try {
      try {
        await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
      } catch (e: any) {
        if (e.code !== '23505') throw e;
      }

      try {
        await client.query(`
          CREATE TABLE IF NOT EXISTS documents (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id INTEGER NOT NULL,
            filename TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);
      } catch (e: any) {
        if (e.code !== '23505') throw e;
      }
    } catch (error) {
      logger.error(`Erro ao garantir tabela documents: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  async createDocument(userId: number, fileName: any) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO documents (user_id, filename) VALUES ($1, $2) RETURNING id',
        [userId, fileName]
      );
      return result.rows[0].id.toString();
    } catch (error: any) {
      logger.error(`Erro ao criar documento: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  async getDocument(documentId: any) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id, user_id, filename, created_at FROM documents WHERE id = $1',
        [documentId]
      );
      const r = result.rows[0];
      if (r) {
        return {
          id: r.id.toString(),
          user_id: Number(r.user_id),
          filename: r.filename,
          created_at: r.created_at,
        };
      }
      return null;
    } catch (error: any) {
      logger.error(`Erro ao buscar documento ${documentId}: ${error.message}`);
      return null;
    } finally {
      client.release();
    }
  }
}

export default DocumentRepository;

