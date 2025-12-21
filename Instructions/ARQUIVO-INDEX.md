# 📑 Índice de Arquivos - Setup de Bancos de Dados com Docker

## 🚀 Comece Aqui

### 1️⃣ Quick Start (60 segundos)
👉 [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md)

### 2️⃣ Resumo Completo
👉 [SETUP-SUMMARY.md](SETUP-SUMMARY.md)

### 3️⃣ Guia Detalhado
👉 [DOCKER-SETUP-GUIDE.md](DOCKER-SETUP-GUIDE.md)

---

## 📂 Estrutura de Arquivos

```
NutriGPT/
├── docker-compose.db.yml                     ⭐ Configuração Docker
├── .env.docker                               - Variáveis de ambiente
├── DOCKER-QUICKSTART.md                      📖 Início rápido
├── DOCKER-SETUP-GUIDE.md                     📖 Guia completo
├── SETUP-SUMMARY.md                          📖 Resumo
├── ARQUIVO-INDEX.md                          📖 Este arquivo
│
├── scripts/
│   ├── setup-databases-docker.ps1            ⭐ Setup Docker (Windows)
│   ├── setup-databases-docker.sh             ⭐ Setup Docker (Linux/Mac)
│   ├── setup-databases.ps1                   - Setup local (Windows)
│   ├── setup-databases.sh                    - Setup local (Linux/Mac)
│   ├── manage-docker.ps1                     🎮 Gerenciar Docker (Windows)
│   ├── manage-docker.sh                      🎮 Gerenciar Docker (Linux/Mac)
│   ├── validate-setup.ps1                    ✅ Validar setup (Windows)
│   ├── validate-setup.sh                     ✅ Validar setup (Linux/Mac)
│   └── DATABASE-SETUP-README.md              📖 Documentação detalhada
│
└── backend/db/init/
    ├── schema.sql                            - Schema do banco nutri
    └── setup-all-databases.sql               - Script SQL consolidado
```

---

## 📖 Documentação por Tópico

### 🚀 Primeiros Passos

| Arquivo | Descrição |
|---------|-----------|
| [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md) | Comece aqui! Setup em 60 segundos |
| [SETUP-SUMMARY.md](SETUP-SUMMARY.md) | Resumo completo do que foi criado |

### 📚 Guias Detalhados

| Arquivo | Descrição |
|---------|-----------|
| [DOCKER-SETUP-GUIDE.md](DOCKER-SETUP-GUIDE.md) | Guia completo com exemplos |
| [scripts/DATABASE-SETUP-README.md](scripts/DATABASE-SETUP-README.md) | Documentação técnica detalhada |

### 🛠️ Scripts

| Script | SO | Uso | Descrição |
|--------|----|----|-----------|
| `setup-databases-docker.ps1` | Windows | **⭐ PRINCIPAL** | Setup com Docker |
| `setup-databases-docker.sh` | Linux/Mac | **⭐ PRINCIPAL** | Setup com Docker |
| `setup-databases.ps1` | Windows | Alternativa | Setup com PostgreSQL local |
| `setup-databases.sh` | Linux/Mac | Alternativa | Setup com PostgreSQL local |
| `manage-docker.ps1` | Windows | Gerenciamento | Controlar Docker depois |
| `manage-docker.sh` | Linux/Mac | Gerenciamento | Controlar Docker depois |
| `validate-setup.ps1` | Windows | Validação | Verificar se tudo funcionou |
| `validate-setup.sh` | Linux/Mac | Validação | Verificar se tudo funcionou |

### 🔧 Configuração

| Arquivo | Descrição |
|---------|-----------|
| `docker-compose.db.yml` | Configuração Docker Compose para PostgreSQL |
| `.env.docker` | Variáveis de ambiente (username, password, port) |

---

## 🎯 Fluxo de Uso

### 1️⃣ Setup Inicial

**Windows (PowerShell):**
```powershell
.\scripts\setup-databases-docker.ps1
```

**Linux/Mac (Bash):**
```bash
chmod +x scripts/setup-databases-docker.sh
./scripts/setup-databases-docker.sh
```

### 2️⃣ Validar Setup

**Windows:**
```powershell
.\scripts\validate-setup.ps1
```

**Linux/Mac:**
```bash
./scripts/validate-setup.sh
```

### 3️⃣ Gerenciar Depois

**Windows:**
```powershell
.\scripts\manage-docker.ps1 status
.\scripts\manage-docker.ps1 logs
.\scripts\manage-docker.ps1 psql
```

**Linux/Mac:**
```bash
./scripts/manage-docker.sh status
./scripts/manage-docker.sh logs
./scripts/manage-docker.sh psql
```

---

## 📊 O Que Cada Arquivo Faz

### Configuração (`docker-compose.db.yml`)
- Define imagem PostgreSQL 16 Alpine
- Configura portas (5432)
- Define volumes para persistência
- Configura healthcheck
- Define variáveis de ambiente

### Setup Principal (`setup-databases-docker.*`)
1. Verifica Docker
2. Inicia container PostgreSQL
3. Aguarda que PostgreSQL esteja pronto
4. Cria 2 bancos de dados
5. Executa schemas SQL
6. Insere dados de teste

### Setup Local (`setup-databases.*`)
- Mesmas operações mas para PostgreSQL local
- Não depende de Docker

### Gerenciamento (`manage-docker.*`)
- Iniciar, parar, reiniciar Docker
- Ver logs, status, recursos
- Conectar ao PostgreSQL
- Acessar shell do container

### Validação (`validate-setup.*`)
- Verifica se Docker está instalado
- Verifica se psql está instalado
- Verifica containers em execução
- Verifica conexão com PostgreSQL
- Verifica bancos de dados
- Verifica tabelas
- Verifica dados de teste

---

## 🔌 Informações de Conexão

Após executar setup:

```
Host:     localhost
Port:     5432
User:     postgres
Password: postgres
Bancos:   nutri, user_db
```

### Configurar nos backends

**Backend CHAT** - `backend/chat/.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nutri
```

**Backend MONEY-MATE** - `backend/money-mate/.env`:
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=user_db
DB_PORT=5432
```

---

## 🆘 Problemas?

1. **Docker não encontrado**
   - Instale: https://www.docker.com/products/docker-desktop

2. **psql não encontrado**
   - Windows: https://www.postgresql.org/download/windows/
   - Mac: `brew install postgresql`
   - Linux: `apt-get install postgresql-client`

3. **Mais dúvidas?**
   - Veja: [scripts/DATABASE-SETUP-README.md](scripts/DATABASE-SETUP-README.md)

---

## 📚 Referências Rápidas

### SQL Direto
```bash
# Usar script SQL consolidado
psql -h localhost -U postgres -f backend/db/init/setup-all-databases.sql

# Conectar e usar comandos psql
psql -h localhost -U postgres
\l          # Listar bancos
\c nutri    # Conectar ao banco
\dt         # Listar tabelas
\quit       # Sair
```

### Docker Direto
```bash
# Ver containers
docker ps

# Ver logs
docker logs -f nutrigpt-postgres

# Entrar no container
docker exec -it nutrigpt-postgres bash

# Parar/Iniciar
docker stop nutrigpt-postgres
docker start nutrigpt-postgres

# Remover tudo (⚠️ remove dados!)
docker-compose -f docker-compose.db.yml down -v
```

---

## 📋 Checklist de Setup

- [ ] Ler [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md)
- [ ] Instalar Docker (se usar Docker setup)
- [ ] Instalar PostgreSQL Client Tools (psql)
- [ ] Executar script setup apropriado
- [ ] Executar validação
- [ ] Configurar .env nos backends
- [ ] Inicie os backends
- [ ] Teste a conectividade

---

## ✨ Resumo Rápido

| O quê | Onde |
|------|------|
| Começar | [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md) |
| Setup Windows | `.\scripts\setup-databases-docker.ps1` |
| Setup Linux/Mac | `./scripts/setup-databases-docker.sh` |
| Gerenciar | `manage-docker.ps1` / `manage-docker.sh` |
| Validar | `validate-setup.ps1` / `validate-setup.sh` |
| Docs completas | [scripts/DATABASE-SETUP-README.md](scripts/DATABASE-SETUP-README.md) |

---

## 🎉 Próximo Passo

👉 Abra [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md) e execute o script para seu SO!

---

*Última atualização: Dezembro 2025*
