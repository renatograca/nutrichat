import pool from '../db/pool';
import { logger } from '../utils/logger';

class ChatRepository {
  constructor() {
    this._ensureTables();
  }

  async _ensureTables() {
    const client = await pool.connect();
    try {
      // Criar extensão pgcrypto se necessária
      await client.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

      // Tabela de Chats
      await client.query(`
        CREATE TABLE IF NOT EXISTS chats (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id TEXT NOT NULL,
          document_id UUID REFERENCES documents(id),
          title TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Índice para document_id
      await client.query(
        'CREATE INDEX IF NOT EXISTS idx_chats_document_id ON chats(document_id);'
      );

      // Tabela de Mensagens
      await client.query(`
        CREATE TABLE IF NOT EXISTS chat_message (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
          role TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      await client.query('COMMIT;');
    } catch (error) {
      logger.error(`Erro ao garantir tabelas: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  async createChat(userId: any, title: any = null) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'INSERT INTO chats (user_id, title) VALUES ($1, $2) RETURNING id',
        [userId, title]
      );
      return result.rows[0].id.toString();
    } catch (error: any) {
      logger.error(`Erro ao criar chat: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  async updateChatDocument(chatId: any, documentId: any) {
    const client = await pool.connect();
    try {
      await client.query(
        'UPDATE chats SET document_id = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [documentId, chatId]
      );
    } catch (error: any) {
      logger.error(`Erro ao atualizar documento do chat: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  async updateChatTitle(chatId: any, title: any) {
    const client = await pool.connect();
    try {
      await client.query(
        'UPDATE chats SET title = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [title, chatId]
      );
    } catch (error: any) {
      logger.error(`Erro ao atualizar título do chat: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  async getUserChats(userId: any) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id, user_id, document_id, title, created_at, updated_at FROM chats WHERE user_id = $1 ORDER BY updated_at DESC',
        [userId]
      );
      return result.rows.map((r: any) => ({
        id: r.id.toString(),
        user_id: r.user_id,
        document_id: r.document_id ? r.document_id.toString() : null,
        title: r.title,
        created_at: r.created_at,
        updated_at: r.updated_at,
      }));
    } catch (error: any) {
      logger.error(`Erro ao buscar chats do usuário: ${error.message}`);
      return [];
    } finally {
      client.release();
    }
  }

  async getChat(chatId: any) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id, user_id, document_id, title, created_at, updated_at FROM chats WHERE id = $1',
        [chatId]
      );
      const r = result.rows[0];
      if (r) {
        return {
          id: r.id.toString(),
          user_id: r.user_id,
          document_id: r.document_id ? r.document_id.toString() : "",
          title: r.title,
          created_at: r.created_at,
          updated_at: r.updated_at,
        };
      }
      return {} as any;
    } catch (error: any) {
      logger.error(`Erro ao buscar chat ${chatId}: ${error.message}`);
      return {} as any;
    } finally {
      client.release();
    }
  }

  async deleteChat(chatId: any) {
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM chats WHERE id = $1', [chatId]);
    } catch (error: any) {
      logger.error(`Erro ao deletar chat ${chatId}: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  async addMessage(chatId: any, role: any, content: any) {
    const client = await pool.connect();
    try {
      await client.query(
        'INSERT INTO chat_message (chat_id, role, content) VALUES ($1, $2, $3)',
        [chatId, role, content]
      );
      await client.query(
        'UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [chatId]
      );
    } catch (error: any) {
      logger.error(`Erro ao adicionar mensagem no chat ${chatId}: ${error.message}`);
      throw error;
    } finally {
      client.release();
    }
  }

  async getChatMessages(chatId: any, limit: any = 50) {
    const client = await pool.connect();
    try {
      const result = await client.query(
        'SELECT id, role, content, created_at FROM chat_message WHERE chat_id = $1 ORDER BY created_at ASC LIMIT $2',
        [chatId, limit]
      );
      return result.rows.map((r: any) => ({
        id: r.id.toString(),
        role: r.role,
        content: r.content,
        created_at: r.created_at,
      }));
    } catch (error: any) {
      logger.error(`Erro ao buscar mensagens do chat ${chatId}: ${error.message}`);
      return [];
    } finally {
      client.release();
    }
  }
}

export default ChatRepository;

