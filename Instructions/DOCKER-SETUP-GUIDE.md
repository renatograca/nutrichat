# 📚 Guia Completo - Docker Setup para NutriGPT

## Resumo dos Arquivos Criados

### 🐳 Docker
- **`docker-compose.db.yml`** - Configuração do PostgreSQL em Docker
- **`.env.docker`** - Variáveis de ambiente para Docker

### 🛠️ Scripts de Setup
- **`scripts/setup-databases-docker.ps1`** - Setup Docker (Windows) ⭐
- **`scripts/setup-databases-docker.sh`** - Setup Docker (Linux/Mac) ⭐
- **`scripts/setup-databases.ps1`** - Setup local (Windows)
- **`scripts/setup-databases.sh`** - Setup local (Linux/Mac)

### 🎮 Scripts de Gerenciamento
- **`scripts/manage-docker.ps1`** - Gerenciar Docker (Windows)
- **`scripts/manage-docker.sh`** - Gerenciar Docker (Linux/Mac)

### 📖 Documentação
- **`DOCKER-QUICKSTART.md`** - Quick start de 60 segundos
- **`scripts/DATABASE-SETUP-README.md`** - Documentação completa
- **`backend/db/init/setup-all-databases.sql`** - Script SQL consolidado

---

## 🚀 Começar (Escolha um)

### ⭐ Recomendado: Com Docker

**Windows (PowerShell):**
```powershell
.\scripts\setup-databases-docker.ps1
```

**Linux/Mac (Bash):**
```bash
chmod +x scripts/setup-databases-docker.sh
./scripts/setup-databases-docker.sh
```

### Alternativa: Com PostgreSQL Local

**Windows (PowerShell):**
```powershell
.\scripts\setup-databases.ps1
```

**Linux/Mac (Bash):**
```bash
chmod +x scripts/setup-databases.sh
./scripts/setup-databases.sh
```

---

## 🎯 O Que Foi Automatizado

### ✅ Inicialização
1. Verifica Docker/PostgreSQL
2. Inicia container PostgreSQL (se usando Docker)
3. Aguarda que PostgreSQL esteja pronto
4. Cria 2 bancos de dados: `nutri` e `user_db`
5. Executa schemas
6. Insere dados de teste

### ✅ Bancos Criados
- **nutri** - Chat AI (com pgvector para embeddings)
- **user_db** - Usuários e configurações (money-mate)

### ✅ Tabelas Criadas

#### Banco `nutri`
- `vector_store` - Embeddings de documentos
- `chats` - Conversas
- `messages` - Mensagens
- `documents` - Documentos

#### Banco `user_db`
- `users` - Usuários
- `addresses` - Endereços
- `user_preferences` - Preferências
- `transactions` - Transações (optional)
- `budgets` - Orçamentos (optional)

---

## 🛑 Gerenciar Docker Depois

### Windows (PowerShell)

```powershell
# Ver status
.\scripts\manage-docker.ps1 status

# Ver logs
.\scripts\manage-docker.ps1 logs

# Parar
.\scripts\manage-docker.ps1 stop

# Iniciar
.\scripts\manage-docker.ps1 start

# Reiniciar
.\scripts\manage-docker.ps1 restart

# Conectar ao PostgreSQL
.\scripts\manage-docker.ps1 psql

# Shell no container
.\scripts\manage-docker.ps1 shell

# Ver recursos
.\scripts\manage-docker.ps1 stats
```

### Linux/Mac (Bash)

```bash
chmod +x scripts/manage-docker.sh

# Ver status
./scripts/manage-docker.sh status

# Ver logs
./scripts/manage-docker.sh logs

# Parar
./scripts/manage-docker.sh stop

# ... (mesmos comandos que PowerShell)
```

### Ou use Docker direto

```bash
# Ver containers
docker ps

# Ver logs
docker-compose -f docker-compose.db.yml logs -f

# Parar
docker-compose -f docker-compose.db.yml stop

# Iniciar
docker-compose -f docker-compose.db.yml start

# Parar e remover
docker-compose -f docker-compose.db.yml down
```

---

## 🔌 Informações de Conexão

Após rodar o setup:

```
Host:     localhost
Port:     5432
User:     postgres
Password: postgres
Database: nutri (ou user_db)
```

### Configurar nos backends

**Backend CHAT (.env)**
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nutri
```

**Backend MONEY-MATE (.env)**
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=user_db
DB_PORT=5432
```

---

## 📊 Estrutura Docker

### Imagem
- **PostgreSQL 16 Alpine** (~200MB, leve)
- Com support para pgvector

### Container
- **Nome**: `nutrigpt-postgres`
- **Porta**: 5432
- **Rede**: `nutrigpt-network`

### Volumes
- **postgres_data** - Dados persistentes
- **./backend/db/init** - Scripts de inicialização

### Healthcheck
- Testa se PostgreSQL está pronto
- Intervalo: 10s, Timeout: 5s, Retries: 5

---

## ⚙️ Pré-requisitos

### Para Docker Setup ⭐ Recomendado
- Docker Desktop
- PostgreSQL Client Tools (psql)
- PowerShell (Windows) ou Bash (Linux/Mac)

### Para Local Setup
- PostgreSQL instalado e rodando
- psql disponível no PATH

### Instalação de Pré-requisitos

**Windows:**
- Docker: https://www.docker.com/products/docker-desktop
- PostgreSQL: https://www.postgresql.org/download/windows/

**Mac:**
```bash
brew install docker
brew install postgresql
# ou instale Docker Desktop que inclui Docker
```

**Linux (Ubuntu/Debian):**
```bash
apt-get install docker.io docker-compose postgresql-client
```

---

## 🐛 Troubleshooting Rápido

### "Docker não encontrado"
→ Instale Docker Desktop

### "psql: comando não encontrado"
→ Instale PostgreSQL Client Tools

### "Port 5432 already in use"
→ Mude a porta no `docker-compose.db.yml`

### "PostgreSQL não responde"
→ Verifique logs: `docker-compose -f docker-compose.db.yml logs`

### Container corrompido
→ Recrie tudo: `docker-compose -f docker-compose.db.yml down -v`

Para troubleshooting completo, veja [scripts/DATABASE-SETUP-README.md](scripts/DATABASE-SETUP-README.md)

---

## 📚 Referências

- [Docker Docs](https://docs.docker.com/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [pgvector](https://github.com/pgvector/pgvector)
- [FastAPI](https://fastapi.tiangolo.com/)

---

## 🤝 Próximos Passos

1. ✅ Execute o setup apropriado para seu SO
2. ✅ Verifique que os bancos foram criados: `psql -l`
3. ✅ Configure .env nos backends
4. ✅ Inicie os serviços dos backends
5. ✅ Teste a conectividade com os bancos

---

**Tudo pronto!** 🎉 Execute um dos scripts de setup e seus bancos de dados estarão prontos em segundos!
