# 🚀 Quick Start - Databases Docker Setup

## ⚡ Start Rápido (60 segundos)

### Windows (PowerShell)
```powershell
# 1. Abra PowerShell na pasta do projeto
cd C:\Users\seu_usuario\OneDrive\Documents\NutriGPT

# 2. Execute o script
.\scripts\setup-databases-docker.ps1

# Pronto! PostgreSQL está rodando em Docker 🎉
```

### Linux/Mac (Bash)
```bash
# 1. Navegue até a pasta do projeto
cd ~/Documents/NutriGPT

# 2. Torne o script executável
chmod +x scripts/setup-databases-docker.sh

# 3. Execute
./scripts/setup-databases-docker.sh

# Pronto! PostgreSQL está rodando em Docker 🎉
```

## 🎯 O que acontece automaticamente

✅ Docker inicia PostgreSQL em um container  
✅ Dois bancos de dados são criados: `nutri` e `user_db`  
✅ Schemas são executados  
✅ Dados de teste são inseridos  
✅ PostgreSQL está pronto para usar  

## 📝 Informações de Conexão

Depois do setup, você pode conectar com:

```
Host: localhost
Port: 5432
User: postgres
Password: postgres
Database: nutri (ou user_db)
```

## 🛑 Parar o Docker

```powershell
# Windows
.\scripts\setup-databases-docker.ps1 -Down

# Linux/Mac
./scripts/setup-databases-docker.sh down
```

## 🔄 Reiniciar do Zero

```powershell
# Windows
.\scripts\setup-databases-docker.ps1 -Restart

# Linux/Mac
./scripts/setup-databases-docker.sh restart
```

## 📚 Documentação Completa

Veja [scripts/DATABASE-SETUP-README.md](scripts/DATABASE-SETUP-README.md) para documentação detalhada, troubleshooting e opções avançadas.

## ⚙️ Pré-requisitos

- ✅ Docker Desktop instalado
- ✅ PostgreSQL Client Tools (psql) instalado
- ✅ (Windows) PowerShell executável deve permitir scripts

## 🆘 Problema Rápido?

```bash
# Ver logs do Docker
docker-compose -f docker-compose.db.yml logs

# Parar tudo e começar novamente
docker-compose -f docker-compose.db.yml down
# Depois execute o setup novamente

# Listar containers
docker ps
```

---

**Pronto para começar?** Execute o script do seu sistema operacional acima! 🚀
