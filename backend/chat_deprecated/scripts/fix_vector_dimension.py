import psycopg2
from app.config import DATABASE_URL
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def update_schema():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        with conn.cursor() as cur:
            # Verifica a dimensão atual
            cur.execute("""
                SELECT atttypmod 
                FROM pg_attribute 
                WHERE attrelid = 'vector_store'::regclass 
                AND attname = 'embedding';
            """)
            row = cur.fetchone()
            if row:
                current_dim = row[0]
                if current_dim != 768:
                    logger.info(f"Alterando dimensão de {current_dim} para 768...")
                    # Para alterar a dimensão no pgvector, geralmente precisamos recriar a coluna
                    cur.execute("ALTER TABLE vector_store DROP COLUMN embedding;")
                    cur.execute("ALTER TABLE vector_store ADD COLUMN embedding vector(768);")
                    conn.commit()
                    logger.info("Coluna 'embedding' atualizada com sucesso.")
                else:
                    logger.info("A coluna 'embedding' já possui a dimensão 768.")
            else:
                logger.info("Tabela 'vector_store' não encontrada. O código _ensure_table irá criá-la.")
        conn.close()
    except Exception as e:
        logger.error(f"Erro ao atualizar schema: {e}")

if __name__ == "__main__":
    update_schema()
