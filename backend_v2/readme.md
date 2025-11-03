# 🥦 NutriChat RAG — Backend em Python

Projeto backend desenvolvido em **FastAPI** com **integração RAG (Retrieval-Augmented Generation)** para responder perguntas sobre nutrição usando PDFs armazenados no **PostgreSQL + pgvector**.

---

## 🧱 Estrutura do Projeto
```
backend_v2/
│
├── app/
│ ├── api/
│ │ ├── endpoints/
│ │ │ ├── chat.py
│ │ │ └── documents.py
│ │ └── init.py
│ ├── core/
│ │ ├── chat_service.py
│ │ ├── document_service.py
│ │ ├── vectorstore.py
│ │ └── init.py
│ ├── main.py
│ └── init.py
│
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## ⚙️ Pré-requisitos

Antes de começar, você precisa ter instalado:
- 🐍 **Python 3.11+**
- 🐘 **Docker e Docker Compose**
- 🧠 (Opcional) **VS Code** com a extensão *Python*

---

## 🚀 Como rodar o projeto localmente (sem Docker)

### 1️⃣ Criar o ambiente virtual
Abra o terminal na pasta do projeto (`backend_v2`) e execute:

python -m venv venv
2️⃣ Ativar o ambiente virtual
🪟 Windows PowerShell:
```bash
.\venv\Scripts\Activate.ps1
```

⚠️ Se o PowerShell bloquear o script, execute antes:
```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```
🐧 Linux / macOS:
```
source venv/bin/activate
```
3️⃣ Instalar as dependências

Com o ambiente virtual ativado:
```
pip install --upgrade pip
pip install -r requirements.txt
```
4️⃣ Rodar o servidor FastAPI
```
uvicorn app.main:app --reload
python -m uvicorn app.main:app --reload
```

O servidor será iniciado em:
👉 http://127.0.0.1:8000

5️⃣ Testar a API

Documentação interativa: http://127.0.0.1:8000/docs

Documentação alternativa: http://127.0.0.1:8000/redoc

🐳 Rodando com Docker
1️⃣ Build da imagem
```
docker build -t nutrichat-backend .
```
2️⃣ Subir os containers (API + Postgres)
docker-compose up --build


Isso criará:

nutrichat-backend → servidor FastAPI

pgvector → banco PostgreSQL com extensão pgvector habilitada

3️⃣ Acessar a aplicação

Após subir os containers:
👉 http://localhost:8000/docs

🧹 Comandos úteis
Ação	Comando
Ativar ambiente virtual	.\venv\Scripts\Activate.ps1 (Windows)
Desativar ambiente virtual	deactivate
Instalar pacotes novos	pip install nome-do-pacote
Atualizar requirements.txt	pip freeze > requirements.txt
Parar containers Docker	docker-compose down
Limpar caches Python	`Get-ChildItem -Recurse -Directory -Filter "pycache"
🧠 Endpoints principais
Método	Rota	Descrição
POST	/api/chat/ingest	Envia e processa um PDF
GET	/api/chat/pergunta?message=	Faz uma pergunta usando RAG
🪄 Dica

Se estiver usando o VS Code, selecione o interpretador Python apontando para o seu ambiente virtual:

Ctrl + Shift + P → Python: Select Interpreter → .\venv\Scripts\python.exe

🧩 Banco de Dados e Vetores

O projeto usa PostgreSQL com pgvector.
O docker-compose.yml já cria o container com a extensão configurada.

Exemplo de schema no Postgres:
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    file_name TEXT,
    content TEXT,
    embedding VECTOR(1536)
);


As conexões são feitas via variável de ambiente:

DATABASE_URL=postgresql://postgres:postgres@pgvector:5432/nutri

🧾 Licença

MIT © 2025 — Desenvolvido por Renato Graça


---

Quer que eu adicione um exemplo de **`.env`** (com variáveis para a chave da API, nome do banco, etc.) e ajustar o `vectorstore.py` para ler