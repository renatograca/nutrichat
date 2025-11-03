import psycopg2
import os
from config import DATABASE_URL
from psycopg2.extras import Json

class VectorStore:
    def __init__(self):
        self.conn = psycopg2.connect(DATABASE_URL)
        self._ensure_table()

    def _ensure_table(self):
        with self.conn.cursor() as cur:
            cur.execute("""
            CREATE TABLE IF NOT EXISTS vector_store (
                id SERIAL PRIMARY KEY,
                content TEXT,
                metadata JSONB,
                embedding vector(1536)
            );
            """)
            self.conn.commit()

    def add(self, content: str, metadata: dict, embedding: list):
        with self.conn.cursor() as cur:
            cur.execute("""
                INSERT INTO vector_store (content, metadata, embedding)
                VALUES (%s, %s, %s)
            """, (content, Json(metadata), embedding))
            self.conn.commit()

    def similarity_search(self, query_embedding: list, top_k: int = 5):
        with self.conn.cursor() as cur:
            cur.execute("""
            SELECT content, metadata FROM vector_store
            ORDER BY embedding <-> %s
            LIMIT %s
            """, (query_embedding, top_k))
            return cur.fetchall()
