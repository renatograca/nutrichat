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

    def similarity_search(self, query_embedding: list, user_id: str, top_k: int = 5):
        vector_str = "[" + ",".join(map(str, np.array(query_embedding).tolist())) + "]"

        with self.conn.cursor() as cur:
            cur.execute(
                """
                SELECT content, metadata
                FROM vector_store
                WHERE metadata->>'user_id' = %s
                ORDER BY embedding <-> %s::vector
                LIMIT %s
            """,
                (user_id, vector_str, top_k),
            )
            results = cur.fetchall()
        return results
