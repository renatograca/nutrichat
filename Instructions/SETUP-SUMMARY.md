# 🎉 Summary - Docker Setup Completo para NutriGPT

## ✅ Arquivos Criados com Sucesso

### 📦 Configuração Docker

```
docker-compose.db.yml          - Configuração do PostgreSQL em Docker
.env.docker                    - Variáveis de ambiente para Docker
```

### 🚀 Scripts de Setup (Windows - PowerShell)

```
scripts/setup-databases-docker.ps1    ⭐ Setup com Docker (RECOMENDADO)
scripts/setup-databases.ps1           - Setup com PostgreSQL local
```

### 🚀 Scripts de Setup (Linux/Mac - Bash)

```
scripts/setup-databases-docker.sh     ⭐ Setup com Docker (RECOMENDADO)
scripts/setup-databases.sh            - Setup com PostgreSQL local
```

### 🎮 Scripts de Gerenciamento

```
scripts/manage-docker.ps1             - Gerenciar Docker (Windows)
scripts/manage-docker.sh              - Gerenciar Docker (Linux/Mac)
```

### 📚 Documentação

```
DOCKER-QUICKSTART.md                  - Quick start de 60 segundos
DOCKER-SETUP-GUIDE.md                 - Guia completo
scripts/DATABASE-SETUP-README.md       - Documentação detalhada
backend/db/init/setup-all-databases.sql - Script SQL consolidado
```

---

## 🎯 Uso Rápido (Escolha Seu SO)

### 🪟 Windows (PowerShell)

```powershell
# Abrir PowerShell na pasta do projeto
cd C:\Users\seu_usuario\OneDrive\Documents\NutriGPT

# Executar setup com Docker (RECOMENDADO)
.\scripts\setup-databases-docker.ps1

# Ou parar o Docker depois
.\scripts\setup-databases-docker.ps1 -Down

# Ou reiniciar
.\scripts\setup-databases-docker.ps1 -Restart

# Gerenciar Docker
.\scripts\manage-docker.ps1 status
.\scripts\manage-docker.ps1 logs
.\scripts\manage-docker.ps1 psql
```

### 🐧 Linux / 🍎 Mac (Bash)

```bash
# Navegar para a pasta do projeto
cd ~/Documents/NutriGPT

# Tornar scripts executáveis (primeira vez)
chmod +x scripts/setup-databases-docker.sh
chmod +x scripts/manage-docker.sh

# Executar setup com Docker (RECOMENDADO)
./scripts/setup-databases-docker.sh

# Ou parar o Docker depois
./scripts/setup-databases-docker.sh down

# Ou reiniciar
./scripts/setup-databases-docker.sh restart

# Gerenciar Docker
./scripts/manage-docker.sh status
./scripts/manage-docker.sh logs
./scripts/manage-docker.sh psql
```

---

## 📋 O Que Cada Script Faz

### Setup Docker (⭐ PRINCIPAL)
**`setup-databases-docker.ps1` / `setup-databases-docker.sh`**

1. ✅ Verifica se Docker está instalado
2. ✅ Inicia container PostgreSQL
3. ✅ Aguarda que PostgreSQL esteja pronto
4. ✅ Cria bancos de dados: `nutri` e `user_db`
5. ✅ Executa schemas SQL
6. ✅ Insere dados de teste

**Bandeiras (Flags):**
- `-Down` / `down` - Parar containers
- `-Restart` / `restart` - Reiniciar tudo
- Sem flags - Inicia tudo (padrão)

### Gerenciar Docker
**`manage-docker.ps1` / `manage-docker.sh`**

- `start` - Inicia Docker
- `stop` - Para Docker
- `restart` - Reinicia
- `logs` - Ver logs em tempo real
- `status` - Ver status
- `psql` - Conectar ao PostgreSQL
- `shell` - Acessar shell do container
- `stats` - Ver uso de recursos

### Setup Local (Alternativa)
**`setup-databases.ps1` / `setup-databases.sh`**

- Para quando PostgreSQL já está instalado localmente
- Mesmas operações mas sem Docker

---

## 🔌 Conexão ao Banco

Depois de executar, conecte com:

```
Tipo: PostgreSQL
Host: localhost
Port: 5432
User: postgres
Password: postgres
Bancos: nutri, user_db
```

### Dentro dos Backends

**Backend CHAT (`.env`):**
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nutri
```

**Backend MONEY-MATE (`.env`):**
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=user_db
DB_PORT=5432
```

---

## 📊 O Que Foi Criado

### Banco `nutri` (Chat AI)
```sql
vector_store    - Embeddings de documentos (pgvector)
chats          - Conversas dos usuários
messages       - Mensagens das conversas
documents      - Documentos enviados
```

**Extensions PostgreSQL:**
- `vector` - Para busca vetorial
- `hstore` - Para JSON/JSONB
- `uuid-ossp` - Para gerar UUIDs

### Banco `user_db` (Money-Mate)
```sql
users          - Dados dos usuários
addresses      - Endereços
user_preferences - Preferências (tema, idioma, notificações)
transactions   - Transações financeiras (opcional)
budgets        - Orçamentos (opcional)
```

---

## 🐳 Estrutura Docker

```
Imagem:       PostgreSQL 16 Alpine (200MB)
Container:    nutrigpt-postgres
Porta:        5432
Rede:         nutrigpt-network
Volumes:      postgres_data, ./backend/db/init
Healthcheck:  A cada 10s (timeout 5s, 5 retries)
```

---

## ⚙️ Requisitos

### Para Docker Setup ⭐ RECOMENDADO
- [ ] Docker Desktop instalado
- [ ] PostgreSQL Client Tools (psql)
- [ ] PowerShell (Windows) ou Bash (Linux/Mac)

### Para Setup Local
- [ ] PostgreSQL instalado e rodando
- [ ] psql disponível
- [ ] Permissão para criar databases

### Instalar Requisitos

**Windows:**
```powershell
# Docker Desktop
# https://www.docker.com/products/docker-desktop

# PostgreSQL (inclui psql)
# https://www.postgresql.org/download/windows/
```

**Mac:**
```bash
# Docker
brew install docker
# ou instale Docker Desktop

# PostgreSQL
brew install postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get update
sudo apt-get install docker.io docker-compose postgresql-client
```

---

## 🆘 Problemas Comuns

| Problema | Solução |
|----------|---------|
| "Docker não encontrado" | Instale Docker Desktop |
| "psql: comando não encontrado" | Instale PostgreSQL Client Tools |
| "Porta 5432 em uso" | Mude porta no docker-compose.db.yml |
| "PostgreSQL não responde" | `docker-compose logs`, `docker restart` |
| "Container corrompido" | `docker-compose down -v` (remove dados!) |

Para mais troubleshooting, veja: `scripts/DATABASE-SETUP-README.md`

---

## 📚 Documentação Completa

| Arquivo | Conteúdo |
|---------|----------|
| `DOCKER-QUICKSTART.md` | Start de 60 segundos |
| `DOCKER-SETUP-GUIDE.md` | Guia completo com exemplos |
| `scripts/DATABASE-SETUP-README.md` | Documentação detalhada |
| `docker-compose.db.yml` | Configuração Docker |
| `backend/db/init/setup-all-databases.sql` | Script SQL puro |

---

## 🚀 Próximos Passos

1. **Execute o setup:**
   - Windows: `.\scripts\setup-databases-docker.ps1`
   - Linux/Mac: `./scripts/setup-databases-docker.sh`

2. **Verifique os bancos:**
   ```bash
   psql -h localhost -U postgres -l
   ```

3. **Configure .env nos backends**

4. **Inicie os backends**

5. **Teste a conectividade**

---

## 📞 Comandos Úteis

```bash
# Ver containers
docker ps

# Ver logs
docker-compose -f docker-compose.db.yml logs -f

# Conectar ao PostgreSQL
psql -h localhost -U postgres

# Ver status
docker-compose -f docker-compose.db.yml ps

# Parar tudo
docker-compose -f docker-compose.db.yml stop

# Remover tudo (⚠️ remove dados!)
docker-compose -f docker-compose.db.yml down -v
```

---

## ✨ Destaques

✅ **Automatizado** - Um comando, tudo pronto  
✅ **Docker** - Sem instalar PostgreSQL localmente  
✅ **Cross-platform** - Windows, Mac, Linux  
✅ **Scripts auxiliares** - Gerenciar Docker facilmente  
✅ **Bem documentado** - Guias completos e exemplos  
✅ **Dados de teste** - Usuário pré-carregado  
✅ **Fácil troubleshooting** - Dicas e soluções  

---

## 🎉 Pronto para Começar?

Execute um dos scripts acima para seu sistema operacional e seus bancos de dados estarão prontos em segundos!

**Windows:** `.\scripts\setup-databases-docker.ps1`  
**Linux/Mac:** `./scripts/setup-databases-docker.sh`

Sucesso! 🚀
