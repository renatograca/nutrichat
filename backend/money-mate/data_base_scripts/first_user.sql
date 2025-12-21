INSERT INTO users (full_name, email, password_hash) 
VALUES ('Renato Silva', 'renato@email.com', 'senha_hashed');

INSERT INTO addresses (user_id, street, city, state, postal_code, country) 
VALUES (1, 'Rua A', 'São Paulo', 'SP', '12345-678', 'Brasil');

INSERT INTO user_preferences (user_id, notifications_email, theme) 
VALUES (1, TRUE, 'dark');
