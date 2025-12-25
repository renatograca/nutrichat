import os
import sys
from app.core.providers.provider_factory import get_embedding_provider
import psycopg2
from app.config import DATABASE_URL

def diagnose():
    print("--- Diagnóstico de Embeddings ---")
    try:
        provider = get_embedding_provider()
        print(f"Provedor de embedding: {provider.__class__.__name__}")
        
        test_text = "Teste de diagnóstico"
        embedding = provider.embed_text(test_text)
        dimension = len(embedding)
        print(f"Dimensão do embedding gerado: {dimension}")
        
        conn = psycopg2.connect(DATABASE_URL)
        with conn.cursor() as cur:
            cur.execute("""
                SELECT atttypmod 
                FROM pg_attribute 
                WHERE attrelid = 'vector_store'::regclass 
                AND attname = 'embedding';
            """)
            row = cur.fetchone()
            if row:
                # O atttypmod para vetores é a dimensão
                db_dimension = row[0]
                print(f"Dimensão na tabela 'vector_store': {db_dimension}")
                
                if db_dimension != dimension:
                    print(f"ERRO: Incompatibilidade detectada! DB: {db_dimension}, Provider: {dimension}")
                else:
                    print("Dimensões coincidem.")
            else:
                print("Tabela 'vector_store' ou coluna 'embedding' não encontrada.")
        conn.close()
        
    except Exception as e:
        print(f"Erro durante diagnóstico: {e}")

if __name__ == "__main__":
    diagnose()
