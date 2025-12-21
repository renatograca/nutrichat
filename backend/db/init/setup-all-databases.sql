-- ============================================================
-- NutriGPT Database Initialization Script
-- ============================================================
-- Este script cria todas as bases de dados necessárias para os
-- backends (chat e money-mate) do projeto NutriGPT
-- ============================================================

-- ============================================================
-- BANCO DE DADOS 1: NUTRI (Backend CHAT)
-- ============================================================

-- Criar banco de dados
CREATE DATABASE nutri;

-- Conectar ao banco nutri
\c nutri;

-- ============================================================
-- Extensions necessárias para o backend CHAT
-- ============================================================

-- Nota: pgvector pode ser instalado opcionalmente para embeddings
-- CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS hstore;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- Tabelas do backend CHAT
-- ============================================================

-- Tabela de vector store (para embeddings de documentos/chats)
-- Nota: Se usar pgvector, mudar "bytea" para "vector(384)"
CREATE TABLE IF NOT EXISTS vector_store (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    content text,
    metadata json,
    embedding bytea
);

-- Índice para busca eficiente
-- Nota: Se usar pgvector, usar HNSW index: CREATE INDEX IF NOT EXISTS idx_vector_store_embedding ON vector_store USING HNSW (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS idx_vector_store_id ON vector_store(id);

-- Tabela de conversas de chat
CREATE TABLE IF NOT EXISTS chats (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS messages (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
    role VARCHAR(50),  -- 'user' ou 'assistant'
    content TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);

-- Tabela de documentos
CREATE TABLE IF NOT EXISTS documents (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    content_type VARCHAR(100),
    file_size INT,
    uploaded_at TIMESTAMP DEFAULT NOW(),
    user_id INT
);

CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);

-- ============================================================
-- BANCO DE DADOS 2: USER_DB (Backend MONEY-MATE)
-- ============================================================

-- Criar banco de dados
CREATE DATABASE user_db;

-- Conectar ao banco user_db
\c user_db;

-- ============================================================
-- Tabelas do backend MONEY-MATE
-- ============================================================

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    phone VARCHAR(20),
    account_status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Índice para busca por email
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Tabela de endereços
CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) DEFAULT 'Brasil',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- Tabela de configurações de preferências do usuário
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notifications JSONB DEFAULT '{"email": true, "push": true}',
    language VARCHAR(10) DEFAULT 'pt-BR',
    theme VARCHAR(20) DEFAULT 'light',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_preferences_user_id ON user_preferences(user_id);

-- Tabela de transações financeiras (money-mate)
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,  -- 'income' ou 'expense'
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    transaction_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(transaction_date);

-- Tabela de orçamentos
CREATE TABLE IF NOT EXISTS budgets (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    limit_amount DECIMAL(10, 2) NOT NULL,
    period VARCHAR(20) DEFAULT 'monthly',  -- 'monthly', 'yearly', etc.
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON budgets(user_id);

-- ============================================================
-- Verificação Final
-- ============================================================

\echo ''
\echo '========================================='
\echo 'Bases de dados criadas com sucesso!'
\echo '========================================='
\echo ''
\echo 'Bancos de dados disponíveis:'
\echo '  • nutri - Backend CHAT (com extensões vector, hstore, uuid-ossp)'
\echo '  • user_db - Backend MONEY-MATE'
\echo ''
