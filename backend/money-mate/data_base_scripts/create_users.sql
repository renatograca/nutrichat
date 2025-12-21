-- Criação do banco de dados para usuários
CREATE DATABASE user_db;

-- Conectar ao banco de dados
\c user_db;

-- Tabela de usuários
CREATE TABLE users (
    id SERIAL PRIMARY KEY, -- ID único gerado automaticamente
    full_name VARCHAR(100) NOT NULL, -- Nome completo
    email VARCHAR(100) UNIQUE NOT NULL, -- E-mail único
    password_hash VARCHAR(255) NOT NULL, -- Senha criptografada
    date_of_birth DATE, -- Data de nascimento (opcional)
    phone VARCHAR(20), -- Telefone (opcional)
    account_status VARCHAR(20) DEFAULT 'active', -- Status da conta
    created_at TIMESTAMP DEFAULT NOW(), -- Data de cadastro
    updated_at TIMESTAMP DEFAULT NOW() -- Data de atualização
);

-- Tabela de endereços
CREATE TABLE addresses (
    id SERIAL PRIMARY KEY, -- ID único gerado automaticamente
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Relacionamento com usuário
    street VARCHAR(255) NOT NULL, -- Rua
    city VARCHAR(100) NOT NULL, -- Cidade
    state VARCHAR(100) NOT NULL, -- Estado
    postal_code VARCHAR(20) NOT NULL, -- CEP
    country VARCHAR(100) DEFAULT 'Brasil', -- País
    created_at TIMESTAMP DEFAULT NOW(), -- Data de cadastro
    updated_at TIMESTAMP DEFAULT NOW() -- Data de atualização
);

-- Tabela de configurações de preferências
CREATE TABLE user_preferences (
    id SERIAL PRIMARY KEY, -- ID único gerado automaticamente
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Relacionamento com usuário
    notifications JSONB DEFAULT '{"email": true, "push": true}', -- Notificações (JSON para flexibilidade)
    language VARCHAR(10) DEFAULT 'pt-BR', -- Idioma preferido
    theme VARCHAR(20) DEFAULT 'light', -- Tema da interface (ex.: 'light', 'dark')
    created_at TIMESTAMP DEFAULT NOW(), -- Data de criação
    updated_at TIMESTAMP DEFAULT NOW() -- Data de atualização
);

-- Índices para melhorar performance em buscas
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_preferences_user_id ON user_preferences(user_id);
