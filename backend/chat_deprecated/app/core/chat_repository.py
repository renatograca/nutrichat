import psycopg2
import logging
from app.config import DATABASE_URL
from app.core.document_repository import DocumentRepository
from typing import List, Optional
from datetime import datetime

logger = logging.getLogger(__name__)

class ChatRepository:
    def __init__(self):
        self.conn = None
        self._get_connection()
        self._ensure_tables()

    def _get_connection(self):
        if self.conn is None or self.conn.closed != 0:
            self.conn = psycopg2.connect(DATABASE_URL)
        return self.conn

    def _ensure_tables(self):
        conn = self._get_connection()
        try:
            with conn.cursor() as cur:
                # Habilitar extensão para UUID se necessário (PostgreSQL < 13)
                cur.execute("CREATE EXTENSION IF NOT EXISTS \"pgcrypto\";")
                # Tabela de Chats
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS chats (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        user_id TEXT NOT NULL,
                        document_id UUID REFERENCES documents(id),
                        title TEXT,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    );
                """)
                # Criar índice para document_id
                cur.execute("CREATE INDEX IF NOT EXISTS idx_chats_document_id ON chats(document_id);")

                # Tabela de Mensagens
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS chat_message (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
                        role TEXT NOT NULL,
                        content TEXT NOT NULL,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    );
                """)
                conn.commit()
        except Exception as e:
            conn.rollback()
            logger.error(f"Erro ao garantir tabelas: {e}")
            raise

    def create_chat(self, user_id: str, title: str = None) -> str:
        conn = self._get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO chats (user_id, title) VALUES (%s, %s) RETURNING id",
                    (user_id, title)
                )
                chat_id = cur.fetchone()[0]
                conn.commit()
                return str(chat_id)
        except Exception as e:
            conn.rollback()
            logger.error(f"Erro ao criar chat: {e}")
            raise

    def update_chat_document(self, chat_id: str, document_id: str):
        conn = self._get_connection()
        try:
            # Atualizar sem validação direta; endpoint/service deve validar ownership
            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE chats SET document_id = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
                    (document_id, chat_id)
                )
                conn.commit()
        except Exception as e:
            conn.rollback()
            logger.error(f"Erro ao atualizar documento do chat: {e}")
            raise

    def update_chat_title(self, chat_id: str, title: str):
        conn = self._get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE chats SET title = %s, updated_at = CURRENT_TIMESTAMP WHERE id = %s",
                    (title, chat_id)
                )
                conn.commit()
        except Exception as e:
            conn.rollback()
            logger.error(f"Erro ao atualizar título do chat: {e}")
            raise

    def get_user_chats(self, user_id: str) -> List[dict]:
        conn = self._get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id, user_id, document_id, title, created_at, updated_at FROM chats WHERE user_id = %s ORDER BY updated_at DESC",
                    (user_id,)
                )
                rows = cur.fetchall()
                return [
                    {
                        "id": str(r[0]),
                        "user_id": str(r[1]),
                        "document_id": str(r[2]) if r[2] else None,
                        "title": r[3],
                        "created_at": r[4],
                        "updated_at": r[5]
                    } for r in rows
                ]
        except Exception as e:
            conn.rollback()
            logger.error(f"Erro ao buscar chats do usuário: {e}")
            return []

    def get_chat(self, chat_id: str) -> Optional[dict]:
        conn = self._get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id, user_id, document_id, title, created_at, updated_at FROM chats WHERE id = %s",
                    (chat_id,)
                )
                r = cur.fetchone()
                if r:
                    return {
                        "id": str(r[0]),
                        "user_id": str(r[1]),
                        "document_id": str(r[2]) if r[2] else None,
                        "title": r[3],
                        "created_at": r[4],
                        "updated_at": r[5]
                    }
                return None
        except Exception as e:
            conn.rollback()
            logger.error(f"Erro ao buscar chat {chat_id}: {e}")
            return None

    def delete_chat(self, chat_id: str):
        conn = self._get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM chats WHERE id = %s", (chat_id,))
                conn.commit()
        except Exception as e:
            conn.rollback()
            logger.error(f"Erro ao deletar chat {chat_id}: {e}")
            raise

    def add_message(self, chat_id: str, role: str, content: str):
        conn = self._get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO chat_message (chat_id, role, content) VALUES (%s, %s, %s)",
                    (chat_id, role, content)
                )
                cur.execute(
                    "UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = %s",
                    (chat_id,)
                )
                conn.commit()
        except Exception as e:
            conn.rollback()
            logger.error(f"Erro ao adicionar mensagem no chat {chat_id}: {e}")
            raise

    def get_chat_messages(self, chat_id: str, limit: int = 50) -> List[dict]:
        conn = self._get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id, role, content, created_at FROM chat_message WHERE chat_id = %s ORDER BY created_at ASC LIMIT %s",
                    (chat_id, limit)
                )
                rows = cur.fetchall()
                return [
                    {
                        "id": str(r[0]),
                        "role": r[1],
                        "content": r[2],
                        "created_at": r[3]
                    } for r in rows
                ]
        except Exception as e:
            conn.rollback()
            logger.error(f"Erro ao buscar mensagens do chat {chat_id}: {e}")
            return []
