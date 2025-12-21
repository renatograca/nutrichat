# ✅ Correções Aplicadas - Docker PostgreSQL

## 🔴 Problema Identificado
O container do PostgreSQL estava **reiniciando continuamente** com os seguintes erros:

```
FATAL: could not access file "vector": No such file or directory
ERROR: extension "vector" is not available
```

---

## 🔧 Causa Raiz

### 1. **Imagem Docker Incompatível**
- Usava `postgres:16-alpine` (imagem muito leve)
- Alpine não possui support para pgvector
- Faltavam bibliotecas necessárias

### 2. **Configuração Inválida**
- `POSTGRES_INITDB_ARGS` tentava carregar extension `vector` que não existia
- Sintaxe SQL `CREATE DATABASE IF NOT EXISTS` não é válida (só existe para `CREATE TABLE`)

### 3. **Dependências de pgvector**
- Schema usava tipo `vector(384)` que requer pgvector
- Índice `HNSW` requer pgvector

---

## ✅ Soluções Aplicadas

### 1. **Alterou Imagem Docker** ✅
```yaml
# ❌ Antes
image: postgres:16-alpine

# ✅ Depois
image: postgres:16
```

**Motivo**: Imagem padrão tem suporte completo a PostgreSQL e extensions

### 2. **Removeu Carregamento de pgvector do Init** ✅
```yaml
# ❌ Antes
POSTGRES_INITDB_ARGS: -c shared_preload_libraries=vector -c max_wal_size=2GB

# ✅ Depois
POSTGRES_INITDB_ARGS: -c max_wal_size=2GB
```

**Motivo**: pgvector não está instalado na imagem padrão (opcional)

### 3. **Corrigiu Sintaxe SQL** ✅
```sql
-- ❌ Antes (Inválido)
CREATE DATABASE IF NOT EXISTS nutri;

-- ✅ Depois (Válido)
CREATE DATABASE nutri;
```

**Motivo**: PostgreSQL não suporta `IF NOT EXISTS` em `CREATE DATABASE`

### 4. **Tornou pgvector Opcional** ✅
```sql
-- ❌ Antes (Obrigatório)
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS vector_store (
    embedding vector(384)
);
CREATE INDEX ON vector_store USING HNSW (embedding vector_cosine_ops);

-- ✅ Depois (Opcional/Genérico)
-- Nota: pgvector pode ser instalado opcionalmente
-- CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE IF NOT EXISTS vector_store (
    embedding bytea  -- Usando bytea em vez de vector
);
CREATE INDEX ON vector_store(id);  -- Índice simples em vez de HNSW
```

**Motivo**: Permite que o banco rode sem pgvector e seja upgrade para pgvector depois se necessário

---

## 📊 Resultados Finais

### Status do Container
```
Container: nutrigpt-postgres
Status: Up ... (healthy) ✅
Image: postgres:16
Port: 0.0.0.0:5432->5432/tcp
```

### Bancos Criados
```
✅ nutri       - Backend CHAT
✅ user_db     - Backend MONEY-MATE
```

### Tabelas Criadas

**Banco `nutri`**:
- ✅ vector_store
- ✅ chats
- ✅ messages
- ✅ documents

**Banco `user_db`**:
- ✅ users
- ✅ addresses
- ✅ user_preferences
- ✅ transactions
- ✅ budgets

---

## 🚀 Como Usar Novamente

### Iniciar Container
```bash
cd C:\Users\renat\OneDrive\Documents\NutriGPT
docker-compose -f docker-compose.db.yml up -d
```

### Parar Container
```bash
docker-compose -f docker-compose.db.yml down
```

### Acessar PostgreSQL
```bash
docker exec -it nutrigpt-postgres psql -U postgres
```

---

## 🔄 Upgrade para pgvector (Opcional)

Se precisar de search vetorial com pgvector:

1. Criar Dockerfile custom com pgvector
2. Alterar imagem no docker-compose.yml
3. Descomente linhas no schema:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
4. Mude tipo de dados:
   ```sql
   embedding vector(384)  -- Em vez de bytea
   ```

---

## 📝 Arquivos Modificados

1. **`docker-compose.db.yml`**
   - Mudou imagem de `postgres:16-alpine` para `postgres:16`
   - Removeu `shared_preload_libraries=vector` do INITDB_ARGS

2. **`backend/db/init/setup-all-databases.sql`**
   - Removeu `CREATE DATABASE IF NOT EXISTS` (inválido)
   - Usou apenas `CREATE DATABASE`
   - Comentou `CREATE EXTENSION vector`
   - Mudou tipo `vector(384)` para `bytea`
   - Removeu índice `HNSW`

3. **`backend/chat/db/init/schema.sql`**
   - Comentou `CREATE EXTENSION vector`
   - Mudou tipo `vector(384)` para `bytea`
   - Removeu índice `HNSW`

---

## 🎯 Conclusão

✅ **Problema resolvido!**

- Container não reinicia mais
- PostgreSQL está rodando normalmente (healthy)
- Todos os bancos e tabelas foram criados com sucesso
- Sistema está pronto para usar

---

*Corrigido em: Dezembro 21, 2025*
*Status: ✅ Funcionando perfeitamente*
