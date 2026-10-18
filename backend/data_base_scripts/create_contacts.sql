-- Tabela de contatos (somente telefone)
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    phone VARCHAR(15) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_contacts_phone ON contacts(phone);
