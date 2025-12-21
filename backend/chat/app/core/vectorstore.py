import psycopg2
from app.config import DATABASE_URL
from psycopg2.extras import Json
import numpy as np


class VectorStore:
    def __init__(self):
        self.conn = psycopg2.connect(DATABASE_URL)
        self._ensure_table()

    def _ensure_table(self):
        with self.conn.cursor() as cur:
            cur.execute(
                """
            CREATE TABLE IF NOT EXISTS vector_store (
                id SERIAL PRIMARY KEY,
                content TEXT,
                metadata JSONB,
                embedding vector(1536)
            );
            """
            )
            self.conn.commit()

    def add(self, content: str, metadata: dict, embedding: list):
        with self.conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO vector_store (content, metadata, embedding)
                VALUES (%s, %s, %s)
            """,
                (content, Json(metadata), embedding),
            )
            self.conn.commit()

    def similarity_search(self, query_embedding: list, user_id: str, chat_id: str = None, top_k: int = 5):
        vector_str = "[" + ",".join(map(str, np.array(query_embedding).tolist())) + "]"

        query = """
                SELECT content, metadata
                FROM vector_store
                WHERE metadata->>'user_id' = %s
        """
        params = [user_id]

        if chat_id:
            query += " AND metadata->>'chat_id' = %s "
            params.append(chat_id)

        query += """
                ORDER BY embedding <-> %s::vector
                LIMIT %s
        """
        params.extend([vector_str, top_k])

        with self.conn.cursor() as cur:
            cur.execute(query, tuple(params))
            results = cur.fetchall()
        return results
