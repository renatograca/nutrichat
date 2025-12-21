# ✅ Checklist - Docker Setup Completo

## 📦 Arquivos Criados

- [ ] `docker-compose.db.yml` - Configuração Docker PostgreSQL
- [ ] `.env.docker` - Variáveis de ambiente
- [ ] `DOCKER-QUICKSTART.md` - Guia rápido (60s)
- [ ] `DOCKER-SETUP-GUIDE.md` - Guia completo
- [ ] `SETUP-SUMMARY.md` - Resumo
- [ ] `ARQUIVO-INDEX.md` - Índice de navegação

### Scripts Setup

- [ ] `scripts/setup-databases-docker.ps1` ⭐ Windows - Docker
- [ ] `scripts/setup-databases-docker.sh` ⭐ Linux/Mac - Docker
- [ ] `scripts/setup-databases.ps1` Windows - Local
- [ ] `scripts/setup-databases.sh` Linux/Mac - Local

### Scripts Auxiliares

- [ ] `scripts/manage-docker.ps1` - Gerenciar Docker (Windows)
- [ ] `scripts/manage-docker.sh` - Gerenciar Docker (Linux/Mac)
- [ ] `scripts/validate-setup.ps1` - Validar setup (Windows)
- [ ] `scripts/validate-setup.sh` - Validar setup (Linux/Mac)

---

## 🎯 Pré-requisitos

### Para Docker Setup ⭐ RECOMENDADO

- [ ] Docker Desktop instalado
  - Windows: https://www.docker.com/products/docker-desktop
  - Mac: https://www.docker.com/products/docker-desktop
  - Linux: `apt-get install docker.io docker-compose`

- [ ] PostgreSQL Client Tools (psql) instalado
  - Windows: https://www.postgresql.org/download/windows/
  - Mac: `brew install postgresql`
  - Linux: `apt-get install postgresql-client`

- [ ] PowerShell (Windows) ou Bash (Linux/Mac)

### Para Setup Local (Alternativa)

- [ ] PostgreSQL instalado e rodando
- [ ] psql disponível no PATH
- [ ] Permissão de criar databases

---

## 🚀 Execução

### Windows (PowerShell)

```powershell
# 1. Abra PowerShell na pasta do projeto
cd C:\Users\seu_usuario\OneDrive\Documents\NutriGPT

# 2. Execute o setup Docker (RECOMENDADO)
.\scripts\setup-databases-docker.ps1

# ✅ Pronto! Bancos estão criados
```

**Bandeiras opcionais:**
```powershell
# Parar Docker
.\scripts\setup-databases-docker.ps1 -Down

# Reiniciar tudo
.\scripts\setup-databases-docker.ps1 -Restart
```

### Linux / Mac (Bash)

```bash
# 1. Navegue até a pasta do projeto
cd ~/Documents/NutriGPT

# 2. Torne o script executável
chmod +x scripts/setup-databases-docker.sh

# 3. Execute o setup Docker (RECOMENDADO)
./scripts/setup-databases-docker.sh

# ✅ Pronto! Bancos estão criados
```

**Opções:**
```bash
# Parar Docker
./scripts/setup-databases-docker.sh down

# Reiniciar tudo
./scripts/setup-databases-docker.sh restart
```

---

## ✅ Validação

### Depois de executar o setup, verifique:

- [ ] Docker container `nutrigpt-postgres` está rodando
  ```bash
  docker ps
  ```

- [ ] PostgreSQL responde
  ```bash
  psql -h localhost -U postgres -c "SELECT 1;"
  ```

- [ ] Bancos foram criados
  ```bash
  psql -h localhost -U postgres -l
  # Procure por: nutri, user_db
  ```

### Executar validação automática

**Windows:**
```powershell
.\scripts\validate-setup.ps1
```

**Linux/Mac:**
```bash
./scripts/validate-setup.sh
```

---

## 🔌 Configurar Backends

### Backend CHAT

**Arquivo:** `backend/chat/.env`

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nutri
# OU
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=nutri
DB_PORT=5432
```

### Backend MONEY-MATE

**Arquivo:** `backend/money-mate/.env` (ou localização apropriada)

```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=user_db
DB_PORT=5432
```

---

## 🎮 Gerenciar Docker Depois

### Windows (PowerShell)

```powershell
# Ver status
.\scripts\manage-docker.ps1 status

# Ver logs em tempo real
.\scripts\manage-docker.ps1 logs

# Parar Docker
.\scripts\manage-docker.ps1 stop

# Iniciar Docker
.\scripts\manage-docker.ps1 start

# Reiniciar
.\scripts\manage-docker.ps1 restart

# Conectar ao PostgreSQL
.\scripts\manage-docker.ps1 psql

# Acessar shell do container
.\scripts\manage-docker.ps1 shell

# Ver uso de recursos
.\scripts\manage-docker.ps1 stats
```

### Linux/Mac (Bash)

```bash
# Ver status
./scripts/manage-docker.sh status

# Ver logs em tempo real
./scripts/manage-docker.sh logs

# Parar Docker
./scripts/manage-docker.sh stop

# ... (mesmos comandos do PowerShell)
```

---

## 📚 Documentação Disponível

- [ ] Ler [DOCKER-QUICKSTART.md](DOCKER-QUICKSTART.md) - 60 segundos
- [ ] Ler [DOCKER-SETUP-GUIDE.md](DOCKER-SETUP-GUIDE.md) - Guia completo
- [ ] Ler [SETUP-SUMMARY.md](SETUP-SUMMARY.md) - Resumo
- [ ] Ler [ARQUIVO-INDEX.md](ARQUIVO-INDEX.md) - Índice de navegação
- [ ] Ler [scripts/DATABASE-SETUP-README.md](scripts/DATABASE-SETUP-README.md) - Docs técnicas

---

## 🐛 Troubleshooting

### "Docker não encontrado"
- [ ] Instale Docker Desktop
- [ ] Reinicie o terminal/PowerShell

### "psql não encontrado"
- [ ] Instale PostgreSQL Client Tools
- [ ] Verifique se está no PATH

### "Porta 5432 já está em uso"
- [ ] Mude a porta em `docker-compose.db.yml`
- [ ] Ou finalize processo usando a porta
- [ ] Ou use outra máquina/container

### "PostgreSQL não responde"
- [ ] Verifique logs: `docker-compose -f docker-compose.db.yml logs`
- [ ] Reinicie: `docker-compose -f docker-compose.db.yml restart`
- [ ] Recrie: `docker-compose -f docker-compose.db.yml down -v` (remove dados!)

### "Erro ao criar banco de dados"
- [ ] Verifique permissões do usuário PostgreSQL
- [ ] Verifique espaço em disco
- [ ] Verifique logs do PostgreSQL

---

## 🚀 Próximos Passos Após Setup

- [ ] Validar setup (ver seção Validação acima)
- [ ] Configurar `.env` nos backends
- [ ] Instalar dependências dos backends (`pip install -r requirements.txt`, `npm install`, etc)
- [ ] Iniciar backend CHAT
- [ ] Iniciar backend MONEY-MATE
- [ ] Iniciar frontend
- [ ] Testar APIs dos backends
- [ ] Testar integração completa

---

## 💾 Informações de Conexão Padrão

```
Host:     localhost
Port:     5432
User:     postgres
Password: postgres
```

**Bancos criados:**
- `nutri` - Chat AI (com pgvector)
- `user_db` - Usuários e Money-Mate

**Dados de teste pré-carregados:**
- Usuário: `renato@email.com`
- Nome: `Renato Silva`
- Endereço: `Rua A, São Paulo, SP`

---

## 🆘 Ajuda Rápida

| Problema | Solução |
|----------|---------|
| Docker não inicia | Reinicie Docker Desktop |
| Container não responde | `docker-compose restart` |
| Dados antigos persistem | `docker-compose down -v` (cuidado!) |
| Porta em uso | Mude em `docker-compose.db.yml` |
| Sem internet | Compose pode usar cache |
| Outro erro? | Veja [scripts/DATABASE-SETUP-README.md](scripts/DATABASE-SETUP-README.md) |

---

## 📋 Resumo de Arquivos por Função

### Configuração
- `docker-compose.db.yml` - Config Docker
- `.env.docker` - Variáveis de ambiente

### Setup (Execute UM destes)
- `scripts/setup-databases-docker.ps1` ⭐ Windows
- `scripts/setup-databases-docker.sh` ⭐ Linux/Mac
- `scripts/setup-databases.ps1` Windows (local)
- `scripts/setup-databases.sh` Linux/Mac (local)

### Auxiliares (Depois do setup)
- `scripts/manage-docker.ps1` ou `.sh` - Gerenciar
- `scripts/validate-setup.ps1` ou `.sh` - Validar

### Docs
- `DOCKER-QUICKSTART.md` - 60 segundos
- `DOCKER-SETUP-GUIDE.md` - Guia completo
- `SETUP-SUMMARY.md` - Resumo
- `ARQUIVO-INDEX.md` - Índice
- `scripts/DATABASE-SETUP-README.md` - Técnico

---

## ✨ Você está pronto!

Todos os arquivos foram criados e estão prontos para uso. Escolha seu sistema operacional e execute o script apropriado:

**Windows:** `.\scripts\setup-databases-docker.ps1`
**Linux/Mac:** `./scripts/setup-databases-docker.sh`

Seus bancos de dados estarão prontos em minutos! 🚀

---

*Checklist criado em Dezembro 2025*
*Última atualização: Agora*
