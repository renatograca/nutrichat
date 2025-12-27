import pool from '../db/pool';
import { logger } from '../utils/logger';

class VectorStore {
  async _ensureTable() {
    const client = await pool.connect();
    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
      await client.query(`
        CREATE TABLE IF NOT EXISTS vector_store (
          id SERIAL PRIMARY KEY,
          content TEXT,
          metadata JSONB,
          embedding vector(3072)
        );
      `);
      await client.query('COMMIT;');
    } catch (error) {
      logger.error(`Erro ao garantir tabela vector_store: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  async add(content: any, metadata: any, embedding: any) {
    const client = await pool.connect();
    try {
      await client.query(
        'INSERT INTO vector_store (content, metadata, embedding) VALUES ($1, $2, $3)',
        [content, JSON.stringify(metadata), JSON.stringify(embedding)]
      );
    } catch (error: any) {
      logger.error(`Erro ao adicionar vetor: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  async similaritySearch(queryEmbedding: any, { documentId = null, userId = null, chatId = null, topK = 5 }: any = {}) {
    const client = await pool.connect();
    try {
      let query = `
        SELECT content, metadata
        FROM vector_store
        WHERE metadata->>'document_id' = $1
      `;
      const params: any[] = [documentId];

      if (userId) {
        query += ` AND metadata->>'user_id' = $${params.length + 1}`;
        params.push(String(userId));
      }

      if (chatId) {
        query += ` AND metadata->>'chat_id' = $${params.length + 1}`;
        params.push(chatId);
      }

      query += `
        ORDER BY embedding <-> $${params.length + 1}::vector
        LIMIT $${params.length + 2}
      `;
      params.push(JSON.stringify(queryEmbedding));
      params.push(topK);

      const result = await client.query(query, params);
      return result.rows;
    } catch (error: any) {
      logger.error(`Erro ao buscar similaridade: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }
}

export default VectorStore;

