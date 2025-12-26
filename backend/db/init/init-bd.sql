-- ============================================================================
-- INIT DATABASES - NutriChat (Docker)
-- ============================================================================

-- ============================================================================
-- CRIAÇÃO DOS BANCOS
-- ============================================================================

CREATE DATABASE nutri;
CREATE DATABASE user_db;

-- ============================================================================
-- BANCO: nutri (CHAT + RAG)
-- ============================================================================

\c nutri

-- Extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS hstore;
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- Tabela: documents
-- ============================================================================

CREATE TABLE documents (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename varchar NOT NULL,
    content_type varchar,
    file_size integer,
    user_id integer NOT NULL,
    uploaded_at timestamp DEFAULT CURRENT_TIMESTAMP,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_created_at ON documents(created_at);

-- ============================================================================
-- Tabela: chats
-- Chat inicia sem título e sem documento
-- ============================================================================

CREATE TABLE chats (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id integer NOT NULL,
    title varchar,
    document_id uuid REFERENCES documents(id),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_chats_document_id ON chats(document_id);
CREATE INDEX idx_chats_created_at ON chats(created_at);

-- ============================================================================
-- Tabela: messages
-- ============================================================================

CREATE TABLE messages (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
    role varchar(20) NOT NULL,
    content text NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- ============================================================================
-- Tabela: vector_store (RAG)
-- ============================================================================

CREATE TABLE vector_store (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    content text NOT NULL,
    metadata jsonb,
    embedding vector(768),
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vector_store_created_at ON vector_store(created_at);

-- ============================================================================
-- BANCO: user_db (USUÁRIOS)
-- ============================================================================

\c user_db

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS hstore;

-- ============================================================================
-- Tabela: users
-- ============================================================================

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name varchar(100) NOT NULL,
    email varchar(100) UNIQUE NOT NULL,
    date_of_birth date,
    phone varchar(15),
    password_hash varchar(255) NOT NULL,
    account_status varchar(20) DEFAULT 'active',
    created_at timestamp DEFAULT NOW(),
    updated_at timestamp DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================================================
-- FIM
-- ============================================================================

SELECT 'Banco NutriChat inicializado com sucesso 🚀' AS status;
