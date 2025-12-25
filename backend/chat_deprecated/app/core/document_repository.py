import psycopg2
import logging
from app.config import DATABASE_URL
from datetime import datetime

logger = logging.getLogger(__name__)


class DocumentRepository:
    def __init__(self):
        self.conn = None
        self._get_connection()
        self._ensure_table()

    def _get_connection(self):
        if self.conn is None or self.conn.closed != 0:
            self.conn = psycopg2.connect(DATABASE_URL)
        return self.conn

    def _ensure_table(self):
        conn = self._get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("CREATE EXTENSION IF NOT EXISTS \"pgcrypto\";")
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS documents (
                        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                        user_id TEXT NOT NULL,
                        filename TEXT,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                    );
                """)
                conn.commit()
        except Exception as e:
            conn.rollback()
            logger.error(f"Erro ao garantir tabela documents: {e}")
            raise

    def create_document(self, user_id: str, file_name: str) -> str:
        conn = self._get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO documents (user_id, filename) VALUES (%s, %s) RETURNING id",
                    (user_id, file_name)
                )
                doc_id = cur.fetchone()[0]
                conn.commit()
                return str(doc_id)
        except Exception as e:
            conn.rollback()
            logger.error(f"Erro ao criar documento: {e}")
            raise

    def get_document(self, document_id: str):
        conn = self._get_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "SELECT id, user_id, filename, created_at FROM documents WHERE id = %s",
                    (document_id,)
                )
                r = cur.fetchone()
                if r:
                    return {
                        "id": str(r[0]),
                        "user_id": r[1],
                        "filename": r[2],
                        "created_at": r[3]
                    }
                return None
        except Exception as e:
            conn.rollback()
            logger.error(f"Erro ao buscar documento {document_id}: {e}")
            return None
