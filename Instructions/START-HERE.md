# 🎉 SETUP COMPLETO - Docker PostgreSQL para NutriGPT

## ✅ Tudo Pronto!

Criei um **sistema completo e automatizado** para setup de bases de dados com Docker. Tudo que você precisa está pronto para usar!

---

## 🚀 Comece Agora (Escolha seu SO)

### Windows (PowerShell)
```powershell
cd C:\Users\seu_usuario\OneDrive\Documents\NutriGPT
.\scripts\setup-databases-docker.ps1
```

### Linux / Mac (Bash)
```bash
cd ~/Documents/NutriGPT
chmod +x scripts/setup-databases-docker.sh
./scripts/setup-databases-docker.sh
```

**⏱️ Tempo**: ~30-60 segundos
**✅ Resultado**: 2 bancos de dados prontos com todas as tabelas!

---

## 📦 Arquivos Criados (19 no total)

### 🐳 Configuração Docker
- `docker-compose.db.yml` - Configuração do PostgreSQL
- `.env.docker` - Variáveis de ambiente

### 🚀 Scripts de Setup
- `scripts/setup-databases-docker.ps1` ⭐ **PRINCIPAL** (Windows)
- `scripts/setup-databases-docker.sh` ⭐ **PRINCIPAL** (Linux/Mac)
- `scripts/setup-databases.ps1` (Windows - PostgreSQL local)
- `scripts/setup-databases.sh` (Linux/Mac - PostgreSQL local)

### 🎮 Ferramentas de Gerenciamento
- `scripts/manage-docker.ps1` - Gerenciar Docker (Windows)
- `scripts/manage-docker.sh` - Gerenciar Docker (Linux/Mac)
- `scripts/validate-setup.ps1` - Validar setup (Windows)
- `scripts/validate-setup.sh` - Validar setup (Linux/Mac)

### 📚 Documentação
- `DOCKER-QUICKSTART.md` ⭐ **COMECE AQUI** (60 segundos)
- `SETUP-CHECKLIST.md` - Passo a passo
- `DOCKER-SETUP-GUIDE.md` - Guia completo
- `SETUP-SUMMARY.md` - Resumo
- `ARQUIVO-INDEX.md` - Índice de navegação
- `MANIFEST.md` - Manifest de tudo criado
- `scripts/DATABASE-SETUP-README.md` - Docs técnicas
- `README-DOCKER-SETUP.txt` - Resumo visual

### 🛠️ Outros
- `backend/db/init/setup-all-databases.sql` - Script SQL puro

---

## 🎯 O Que Acontece Automaticamente

1. ✅ Verifica se Docker está instalado
2. ✅ Inicia PostgreSQL em um container
3. ✅ Aguarda que PostgreSQL esteja pronto
4. ✅ Cria banco `nutri` (Chat AI)
5. ✅ Cria banco `user_db` (Money-Mate)
6. ✅ Cria 15+ tabelas
7. ✅ Insere dados de teste
8. ✅ Seu banco está pronto para usar! 🎉

---

## 🗄️ Bancos Criados

### `nutri` (Backend CHAT)
- `vector_store` - Embeddings com pgvector
- `chats` - Conversas
- `messages` - Mensagens  
- `documents` - Documentos

### `user_db` (Backend MONEY-MATE)
- `users` - Usuários
- `addresses` - Endereços
- `user_preferences` - Preferências
- `transactions` - Transações
- `budgets` - Orçamentos

---

## 🔌 Conectar Depois

```
Host:     localhost
Port:     5432
User:     postgres
Password: postgres
```

### Configurar nos Backends

**Backend CHAT** - `.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nutri
```

**Backend MONEY-MATE** - `.env`:
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=user_db
DB_PORT=5432
```

---

## 🎮 Gerenciar Docker Depois

```powershell
# Windows
.\scripts\manage-docker.ps1 status
.\scripts\manage-docker.ps1 logs
.\scripts\manage-docker.ps1 psql
.\scripts\manage-docker.ps1 stop
```

```bash
# Linux/Mac
./scripts/manage-docker.sh status
./scripts/manage-docker.sh logs
./scripts/manage-docker.sh psql
./scripts/manage-docker.sh stop
```

---

## 📚 Documentação

| Tempo | Arquivo | Descrição |
|------|---------|-----------|
| ⚡ 2 min | [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md) | Comece aqui! |
| ⏱️ 5 min | [SETUP-CHECKLIST.md](SETUP-CHECKLIST.md) | Passo a passo |
| 📖 10 min | [DOCKER-SETUP-GUIDE.md](DOCKER-SETUP-GUIDE.md) | Guia completo |
| 📕 15 min | [scripts/DATABASE-SETUP-README.md](scripts/DATABASE-SETUP-README.md) | Docs técnicas |

---

## ⚙️ Pré-requisitos

**Para Docker Setup** ⭐ **RECOMENDADO**:
- [ ] Docker Desktop
- [ ] PostgreSQL Client Tools (psql)

**Instalar**:
- **Windows**: https://www.docker.com/products/docker-desktop
- **Mac**: `brew install docker postgresql`
- **Linux**: `apt-get install docker.io postgresql-client`

---

## 🆘 Problemas?

**"Docker não encontrado"** → Instale Docker Desktop

**"psql não encontrado"** → Instale PostgreSQL Client Tools

**Outro erro?** → Veja [scripts/DATABASE-SETUP-README.md](scripts/DATABASE-SETUP-README.md) (seção Troubleshooting)

---

## ✨ Resumo

| Item | Status |
|------|--------|
| Setup automatizado | ✅ |
| Multi-plataforma | ✅ |
| Docker integrado | ✅ |
| Documentação completa | ✅ |
| Ferramentas gerenciamento | ✅ |
| Validação automática | ✅ |
| Pronto para usar | ✅ |

---

## 🚀 Próximos Passos

1. **Leia**: [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md)
2. **Execute**: o script do seu SO
3. **Configure**: .env nos backends
4. **Use**: `manage-docker.ps1/.sh` conforme necessário

---

**Tudo está pronto!** Execute o script e seus bancos de dados estarão prontos em minutos! 🎉

---

*Criado em Dezembro 21, 2025 | v1.0 | Status: ✅ Completo*
