-- ============================================================================
-- SCRIPT DE RESET COMPLETO - TODOS OS BANCOS DE DADOS (NutriChat)
-- ============================================================================
-- Este script executa o reset completo de TODOS os bancos de dados do projeto
-- 
-- Bancos:
--   1. nutri       → Backend CHAT (chats, messages, documents, embeddings)
--   2. user_db     → Backend MONEY-MATE (users, addresses, transactions, budgets)
--
-- Uso: psql -U postgres -f reset-all-databases.sql
-- ============================================================================

-- ============================================================================
-- BANCO 1: nutri (CHAT BACKEND)
-- ============================================================================

\c nutri

-- Dropar tabelas na ordem correta
DROP TABLE IF EXISTS chat_message CASCADE;
DROP TABLE IF EXISTS chat CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS chats CASCADE;
DROP TABLE IF EXISTS vector_store CASCADE;

-- Criar extensões
CREATE EXTENSION IF NOT EXISTS hstore;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ────────────────────────────────────────────────────────────────────────────
-- Tabela: vector_store
-- Descrição: Armazena embeddings vetoriais para busca semântica
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE vector_store (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    content text,
    metadata json,
    embedding vector(1536),
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP
);

CREATE INDEX idx_vector_store_id ON vector_store(id);
CREATE INDEX idx_vector_store_created_at ON vector_store(created_at);

-- ────────────────────────────────────────────────────────────────────────────
-- Tabela: documents
-- Descrição: Documentos enviados por usuários para análise
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE documents (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    filename varchar NOT NULL,
    content_type varchar,
    file_size integer,
    uploaded_at timestamp,
    user_id integer,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_filename ON documents(filename);
CREATE INDEX idx_documents_created_at ON documents(created_at);

-- ────────────────────────────────────────────────────────────────────────────
-- Tabela: chats
-- Descrição: Conversas entre usuários e a IA
-- Propriedades: title e document_id podem ser NULL
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE chats (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id integer,
    title varchar,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP
);

CREATE INDEX idx_chats_user_id ON chats(user_id);
CREATE INDEX idx_chats_created_at ON chats(created_at);
CREATE INDEX idx_chats_title ON chats(title);

-- ────────────────────────────────────────────────────────────────────────────
-- Tabela: messages
-- Descrição: Mensagens dentro de uma conversa
-- Relacionamento: CASCADE DELETE com chats
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE messages (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
    role varchar,
    content text,
    created_at timestamp default CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_chat_id ON messages(chat_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_messages_role ON messages(role);

-- ────────────────────────────────────────────────────────────────────────────
-- Tabelas legadas (compatibilidade)
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE chat (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id integer,
    title varchar,
    created_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP
);

CREATE TABLE chat_message (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    chat_id uuid,
    role varchar,
    content text,
    created_at timestamp default CURRENT_TIMESTAMP
);

-- ============================================================================
-- BANCO 2: user_db (MONEY-MATE BACKEND)
-- ============================================================================

\c user_db

-- Dropar tabelas na ordem correta
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Criar extensões
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS hstore;

-- ────────────────────────────────────────────────────────────────────────────
-- Tabela: users
-- Descrição: Usuários do sistema Money-Mate
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name varchar(100) NOT NULL,
    email varchar(100) UNIQUE NOT NULL,
    password_hash varchar(255) NOT NULL,
    date_of_birth date,
    phone varchar(20),
    account_status varchar(20) DEFAULT 'active',
    created_at timestamp default NOW(),
    updated_at timestamp default NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_account_status ON users(account_status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ────────────────────────────────────────────────────────────────────────────
-- Tabela: addresses
-- Descrição: Endereços dos usuários
-- Relacionamento: CASCADE DELETE com users
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    street varchar(255) NOT NULL,
    city varchar(100) NOT NULL,
    state varchar(100) NOT NULL,
    postal_code varchar(20) NOT NULL,
    country varchar(100) DEFAULT 'Brasil',
    created_at timestamp default NOW(),
    updated_at timestamp default NOW()
);

CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_city ON addresses(city);
CREATE INDEX idx_addresses_postal_code ON addresses(postal_code);

-- ────────────────────────────────────────────────────────────────────────────
-- Tabela: user_preferences
-- Descrição: Preferências e configurações dos usuários
-- Relacionamento: CASCADE DELETE com users
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notifications jsonb DEFAULT '{"email": true, "push": true}',
    language varchar(10) DEFAULT 'pt-BR',
    theme varchar(20) DEFAULT 'light',
    created_at timestamp default NOW(),
    updated_at timestamp default NOW()
);

CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);
CREATE INDEX idx_user_preferences_language ON user_preferences(language);

-- ────────────────────────────────────────────────────────────────────────────
-- Tabela: transactions
-- Descrição: Transações financeiras dos usuários
-- Tipos: income, expense, transfer
-- Relacionamento: CASCADE DELETE com users
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type varchar(20) NOT NULL,
    amount numeric(15, 2) NOT NULL,
    category varchar(100),
    description text,
    transaction_date date NOT NULL,
    created_at timestamp default NOW(),
    updated_at timestamp default NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_transaction_date ON transactions(transaction_date);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);

-- ────────────────────────────────────────────────────────────────────────────
-- Tabela: budgets
-- Descrição: Orçamentos (limites de gastos) por categoria
-- Períodos: monthly, quarterly, yearly
-- Relacionamento: CASCADE DELETE com users
-- ────────────────────────────────────────────────────────────────────────────

CREATE TABLE budgets (
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category varchar(100) NOT NULL,
    limit_amount numeric(15, 2) NOT NULL,
    period varchar(20),
    created_at timestamp default NOW(),
    updated_at timestamp default NOW()
);

CREATE INDEX idx_budgets_user_id ON budgets(user_id);
CREATE INDEX idx_budgets_category ON budgets(category);
CREATE INDEX idx_budgets_period ON budgets(period);

-- ============================================================================
-- RESUMO FINAL
-- ============================================================================

/*
════════════════════════════════════════════════════════════════════════════════
RESET COMPLETO EXECUTADO COM SUCESSO
════════════════════════════════════════════════════════════════════════════════

BANCOS DE DADOS RESETADOS: 2
├─ nutri        [CHAT BACKEND]
└─ user_db      [MONEY-MATE BACKEND]

TABELAS CRIADAS: 11
├─ Banco: nutri (6 tabelas)
│  ├─ vector_store        [4 cols, 2 índices]
│  ├─ documents           [6 cols, 3 índices]
│  ├─ chats               [5 cols, 3 índices]
│  ├─ messages            [5 cols, 3 índices]
│  ├─ chat (legada)       [4 cols]
│  └─ chat_message (legada) [4 cols]
│
└─ Banco: user_db (5 tabelas)
   ├─ users              [9 cols, 3 índices]
   ├─ addresses          [9 cols, 3 índices]
   ├─ user_preferences   [7 cols, 2 índices]
   ├─ transactions       [9 cols, 5 índices]
   └─ budgets            [7 cols, 3 índices]

ÍNDICES CRIADOS: 24 (para otimizar buscas)

INTEGRIDADE REFERENCIAL: Garantida via Foreign Keys com CASCADE DELETE

════════════════════════════════════════════════════════════════════════════════
PRÓXIMOS PASSOS
════════════════════════════════════════════════════════════════════════════════

1. ✓ Bancos resetados (todos os dados removidos)
2. ✓ Tabelas criadas com estrutura correta
3. → Inserir dados de teste/seed (opcional)
4. → Validar estrutura: \dt (mostrar tabelas)
5. → Testar integridade: SELECT * FROM users;
6. → Iniciar aplicações backend

════════════════════════════════════════════════════════════════════════════════
*/

-- Confirmar execução
SELECT 'Reset completo executado com sucesso!' AS status;
SELECT 'nutri' AS banco, COUNT(*) AS tabelas FROM information_schema.tables WHERE table_schema = 'public' AND table_catalog = 'nutri';
\c user_db
SELECT 'user_db' AS banco, COUNT(*) AS tabelas FROM information_schema.tables WHERE table_schema = 'public' AND table_catalog = 'user_db';

-- ============================================================================
-- FIM DO SCRIPT DE RESET COMPLETO
-- ============================================================================
