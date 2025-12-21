# 🗄️ Setup de Bases de Dados - NutriGPT

Este documento descreve os scripts para criar e inicializar todas as bases de dados necessárias para os backends do projeto NutriGPT.

## 📋 Bancos de Dados

O projeto possui **2 bancos de dados principais**:

### 1. **nutri** (Backend CHAT)
- Armazena dados de conversas de chat
- Armazena embeddings de documentos (vetores)
- Tabelas:
  - `vector_store` - Armazena embeddings de documentos
  - `chats` - Conversas dos usuários
  - `messages` - Mensagens das conversas
  - `documents` - Documentos enviados pelos usuários

**Extensions PostgreSQL necessárias:**
- `vector` - Para busca vetorial com pgvector
- `hstore` - Para armazenar dados tipo chave-valor
- `uuid-ossp` - Para gerar UUIDs

### 2. **user_db** (Backend MONEY-MATE)
- Armazena dados de usuários e configurações
- Tabelas:
  - `users` - Dados dos usuários
  - `addresses` - Endereços dos usuários
  - `user_preferences` - Preferências (tema, idioma, notificações)
  - `transactions` - Transações financeiras
  - `budgets` - Orçamentos dos usuários

## 🚀 Como Usar

### Opção 1: Windows (PowerShell) com Docker ⭐ RECOMENDADO

```powershell
# Executar o script que inicia Docker automaticamente
.\scripts\setup-databases-docker.ps1

# Ou com parâmetros customizados
.\scripts\setup-databases-docker.ps1 -PostgresUser "postgres" -PostgresPassword "sua_senha"

# Para parar os containers
.\scripts\setup-databases-docker.ps1 -Down

# Para reiniciar tudo do zero
.\scripts\setup-databases-docker.ps1 -Restart
```

**Pré-requisitos:**
- Docker Desktop instalado
- psql (PostgreSQL Client Tools) disponível no PATH
- Permissões de administrador

### Opção 2: Windows (PowerShell) com PostgreSQL Local

```powershell
# Executar o script com PostgreSQL já instalado localmente
.\scripts\setup-databases.ps1

# Ou com credenciais customizadas
.\scripts\setup-databases.ps1 -PostgresHost "localhost" -PostgresUser "postgres" -PostgresPort "5432" -PostgresPassword "sua_senha"
```

**Pré-requisitos:**
- PostgreSQL instalado localmente
- `psql` disponível no PATH
- Permissões para criar databases

### Opção 3: Linux/Mac (Bash) com Docker ⭐ RECOMENDADO

```bash
# Tornar o script executável (primeira vez)
chmod +x scripts/setup-databases-docker.sh

# Executar o script que inicia Docker automaticamente
./scripts/setup-databases-docker.sh

# Para parar os containers
./scripts/setup-databases-docker.sh down

# Para reiniciar tudo do zero
./scripts/setup-databases-docker.sh restart
```

### Opção 4: Linux/Mac (Bash) com PostgreSQL Local

```bash
# Tornar o script executável (primeira vez)
chmod +x scripts/setup-databases.sh

# Executar com credenciais padrão
./scripts/setup-databases.sh

# Ou com credenciais customizadas
./scripts/setup-databases.sh localhost postgres 5432 sua_senha
```

### Opção 5: SQL Direto (PostgreSQL)

```bash
# Executar o script SQL consolidado
psql -h localhost -U postgres -p 5432 -f backend/db/init/setup-all-databases.sql

# Ou conectar ao PostgreSQL e executar manualmente
psql -h localhost -U postgres
\i backend/db/init/setup-all-databases.sql
```

## 🔧 Parametros dos Scripts

### PowerShell (Docker)
```powershell
-PostgresUser        : Usuário PostgreSQL (padrão: "postgres")
-PostgresPassword    : Senha PostgreSQL (padrão: "postgres")
-PostgresPort        : Porta PostgreSQL (padrão: "5432")
-Down                : Parar os containers
-Restart             : Reiniciar tudo do zero
```

### PowerShell (Local)
```powershell
-PostgresHost        : Host do PostgreSQL (padrão: "localhost")
-PostgresUser        : Usuário PostgreSQL (padrão: "postgres")
-PostgresPort        : Porta PostgreSQL (padrão: "5432")
-PostgresPassword    : Senha PostgreSQL (padrão: "postgres")
-UseDocker           : Usar Docker para PostgreSQL
-StartDocker         : Iniciar Docker automaticamente
```

### Bash (Docker)
```bash
./setup-databases-docker.sh          # Inicia tudo
./setup-databases-docker.sh down     # Para containers
./setup-databases-docker.sh restart  # Reinicia tudo
```

### Bash (Local)
```bash
./setup-databases.sh                 # Credenciais padrão
./setup-databases.sh localhost postgres 5432 senha  # Com credenciais
```

### Variáveis de Ambiente
```bash
# Podem ser definidas antes de executar o script Docker
export POSTGRES_USER="postgres"
export POSTGRES_PASSWORD="sua_senha"
export POSTGRES_PORT="5432"
```

## 📝 Arquivos Utilizados

### Scripts Principais
1. **[scripts/setup-databases-docker.ps1](setup-databases-docker.ps1)** ⭐
   - Setup com Docker (Windows PowerShell)
   - Inicia PostgreSQL em container
   - Recomendado para desenvolvimento local

2. **[scripts/setup-databases-docker.sh](setup-databases-docker.sh)** ⭐
   - Setup com Docker (Linux/Mac Bash)
   - Inicia PostgreSQL em container
   - Recomendado para desenvolvimento local

3. **[scripts/setup-databases.ps1](setup-databases.ps1)**
   - Setup com PostgreSQL local (Windows PowerShell)
   - Requer PostgreSQL já instalado

4. **[scripts/setup-databases.sh](setup-databases.sh)**
   - Setup com PostgreSQL local (Linux/Mac Bash)
   - Requer PostgreSQL já instalado

### Arquivos de Configuração
1. **[docker-compose.db.yml](../docker-compose.db.yml)**
   - Configuração Docker Compose para PostgreSQL
   - Define imagem, volumes, portas, healthcheck
   - Usa variáveis de ambiente

2. **[.env.docker](.env.docker)**
   - Variáveis de ambiente para Docker
   - Copie ou customize conforme necessário

### Arquivos de Schema
1. **[backend/chat/db/init/schema.sql](../backend/chat/db/init/schema.sql)**
   - Schema para o banco de dados `nutri`
   - Cria extensions do PostgreSQL
   - Define tabelas para chat e embeddings

2. **[backend/money-mate/data_base_scripts/create_users.sql](../backend/money-mate/data_base_scripts/create_users.sql)**
   - Cria banco de dados `user_db`
   - Define tabelas de usuários, endereços e preferências

3. **[backend/money-mate/data_base_scripts/first_user.sql](../backend/money-mate/data_base_scripts/first_user.sql)**
   - Insere usuário de teste
   - Insere endereço e preferências de teste

### Arquivo SQL Consolidado
- **[backend/db/init/setup-all-databases.sql](../backend/db/init/setup-all-databases.sql)**
  - Script SQL puro que pode ser executado em qualquer cliente PostgreSQL
  - Cria todos os bancos e tabelas de uma vez

## ✅ O que o Script Faz

1. ✓ Verifica se Docker está instalado (para scripts Docker)
2. ✓ Verifica se PostgreSQL CLI está instalado
3. ✓ Inicia containers PostgreSQL em Docker (para scripts Docker)
4. ✓ Aguarda que PostgreSQL esteja pronto
5. ✓ Cria banco de dados `nutri`
6. ✓ Cria banco de dados `user_db`
7. ✓ Executa schema do backend CHAT
8. ✓ Executa schema do backend MONEY-MATE
9. ✓ Insere dados de teste (usuário inicial)

## 🐳 Docker Setup Detalhes

### Imagem PostgreSQL
- **Base**: `postgres:16-alpine`
- **Tamanho**: ~200MB (imagem leve)
- **Container**: `nutrigpt-postgres`
- **Porta**: `5432` (padrão)
- **Dados**: Persistidos em volume Docker

### Volumes
- `postgres_data` - Armazena dados do PostgreSQL
- `./backend/db/init/` - Scripts de inicialização

### Rede Docker
- `nutrigpt-network` - Rede bridge para comunicação entre containers

### Healthcheck
- Verifica se PostgreSQL responde a `pg_isready`
- Intervalo: 10 segundos
- Timeout: 5 segundos
- Retries: 5 tentativas

### Variáveis de Ambiente
```yaml
POSTGRES_USER: postgres (ou valor do .env.docker)
POSTGRES_PASSWORD: postgres (ou valor do .env.docker)
POSTGRES_INITDB_ARGS: -c shared_preload_libraries=vector
```

## 🔍 Verificação

Para verificar se os bancos de dados foram criados corretamente:

```bash
# Listar todos os bancos de dados
psql -h localhost -U postgres -l

# Conectar ao banco 'nutri'
psql -h localhost -U postgres -d nutri

# Ver tabelas no banco 'nutri'
\dt

# Verificar extensões
\dx

# Sair
\q
```

## 📋 Dados de Teste

O script insere um usuário de teste no banco `user_db`:

```
Email: renato@email.com
Nome: Renato Graças
Senha: (hash vazio)
```

**⚠️ Nota:** A senha está armazenada como hash (vazio no exemplo). Configure uma senha segura em produção.

## 🛠️ Variáveis de Ambiente

Após executar os scripts, configure as variáveis de ambiente dos backends:

### Backend CHAT (`.env`)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nutri
# ou
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=nutri
DB_PORT=5432
```

### Backend MONEY-MATE (`.env`)
```env
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=user_db
DB_PORT=5432
```

## 🐛 Troubleshooting

### Docker Issues

#### "Docker não encontrado!"
- Docker Desktop não está instalado
- Instale: https://www.docker.com/products/docker-desktop
- Reinicie o terminal após instalar

#### "docker-compose.db.yml não encontrado"
- Certifique-se de executar o script a partir do diretório raiz do projeto
- O arquivo deve estar em: `NutriGPT/docker-compose.db.yml`

#### PostgreSQL não responde após 30 tentativas
```bash
# Verifique logs do container
docker-compose -f docker-compose.db.yml logs postgres

# Reinicie o container
docker-compose -f docker-compose.db.yml restart

# Ou recrie tudo do zero
docker-compose -f docker-compose.db.yml down
docker-compose -f docker-compose.db.yml up -d
```

#### Porta 5432 já está em uso
```bash
# Encontre qual processo está usando a porta (Linux/Mac)
lsof -i :5432

# Ou mude a porta no docker-compose.db.yml
# Mude "5432:5432" para "5433:5432" por exemplo
```

#### Volume PostgreSQL corrompido
```bash
# Remova o volume (AVISO: irá deletar dados!)
docker volume rm nutrigpt_postgres_data

# Recrie tudo
docker-compose -f docker-compose.db.yml up -d
```

### PostgreSQL Client Issues

#### "psql: comando não encontrado"
- PostgreSQL Client Tools não está instalado
- **Windows**: Instale https://www.postgresql.org/download/windows/
  - Durante a instalação, deixe selecionado "pgAdmin 4" e "Stack Builder"
  - Command Line Tools são instaladas automaticamente
- **Mac**: `brew install postgresql`
- **Linux**: `apt-get install postgresql-client` (Ubuntu/Debian)
                `yum install postgresql` (CentOS/RHEL)

#### Falha de autenticação com PostgreSQL
```bash
# Verifique credenciais
# Padrão: user=postgres, password=postgres

# Se mudou a senha, atualize no script ou em .env.docker
POSTGRES_PASSWORD=sua_nova_senha
```

### Arquivo Issues

#### "Banco de dados já existe"
- Bancos podem ser reaproveitados
- Para começar do zero, use a flag `-Restart`

#### Schema não foi criado
```bash
# Execute manualmente
psql -h localhost -U postgres -d nutri < backend/chat/db/init/schema.sql
```

### Network Issues

#### Conexão recusada em outro container/serviço
- Use o hostname `postgres` em vez de `localhost`
- Certifique-se de que o serviço está na mesma rede: `nutrigpt-network`

#### Firewall bloqueando porta
- Windows: Adicione PostgreSQL ao firewall
- Linux: `ufw allow 5432`
- macOS: System Preferences → Security & Privacy

## � Monitoramento do Docker

### Ver containers em execução
```bash
docker ps
# ou
docker-compose -f docker-compose.db.yml ps
```

### Ver logs
```bash
# Todos os logs
docker-compose -f docker-compose.db.yml logs

# Logs em tempo real
docker-compose -f docker-compose.db.yml logs -f

# Últimas N linhas
docker-compose -f docker-compose.db.yml logs --tail 50
```

### Ver volumes
```bash
docker volume ls | grep postgres
```

### Conectar ao container
```bash
# Bash no container
docker exec -it nutrigpt-postgres bash

# PostgreSQL psql
docker exec -it nutrigpt-postgres psql -U postgres
```

### Estatísticas de recursos
```bash
docker stats nutrigpt-postgres
```

### Parar/Iniciar/Remover
```bash
# Parar
docker-compose -f docker-compose.db.yml stop

# Iniciar
docker-compose -f docker-compose.db.yml start

# Parar e remover containers
docker-compose -f docker-compose.db.yml down

# Parar, remover containers e volumes
docker-compose -f docker-compose.db.yml down -v
```

## 📚 Referências

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [pgvector Extension](https://github.com/pgvector/pgvector)
- [FastAPI & SQLAlchemy](https://fastapi.tiangolo.com/)

## 🤝 Suporte

Para dúvidas ou problemas:
1. Verifique os logs: `docker-compose -f docker-compose.db.yml logs`
2. Verifique se Docker está rodando
3. Verifique se todas as portas estão disponíveis
4. Consulte a seção de Troubleshooting acima
5. Consulte a documentação do projeto
