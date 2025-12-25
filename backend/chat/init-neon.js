import pkg from 'pg';

const { Client } = pkg;

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ DATABASE_URL não está definido nas variáveis de ambiente.');
  process.exit(1);
}

async function runInitDb() {
  const client = new Client({ connectionString: DATABASE_URL });
  
  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados Neon\n');

    const statements = [
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`,
      `CREATE EXTENSION IF NOT EXISTS hstore`,
      `CREATE EXTENSION IF NOT EXISTS vector`,
      
      `CREATE TABLE IF NOT EXISTS documents (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        filename varchar NOT NULL,
        content_type varchar,
        file_size integer,
        user_id integer NOT NULL,
        uploaded_at timestamp DEFAULT CURRENT_TIMESTAMP,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_documents_created_at ON documents(created_at)`,
      
      `CREATE TABLE IF NOT EXISTS chats (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id integer NOT NULL,
        title varchar,
        document_id uuid REFERENCES documents(id),
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id)`,
      `CREATE INDEX IF NOT EXISTS idx_chats_document_id ON chats(document_id)`,
      `CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats(created_at)`,
      
      `CREATE TABLE IF NOT EXISTS messages (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
        role varchar(20) NOT NULL,
        content text NOT NULL,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id)`,
      `CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at)`,
      
      `CREATE TABLE IF NOT EXISTS vector_store (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        content text NOT NULL,
        metadata jsonb,
        embedding vector(768),
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE INDEX IF NOT EXISTS idx_vector_store_created_at ON vector_store(created_at)`,
      
      `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        full_name varchar(100) NOT NULL,
        email varchar(100) UNIQUE NOT NULL,
        password_hash varchar(255) NOT NULL,
        account_status varchar(20) DEFAULT 'active',
        created_at timestamp DEFAULT NOW(),
        updated_at timestamp DEFAULT NOW()
      )`,
      
      `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`
    ];

    let successCount = 0;
    let errorCount = 0;

    for (const stmt of statements) {
      try {
        const preview = stmt.split('\n')[0].substring(0, 60);
        console.log(`📝 ${preview}...`);
        await client.query(stmt);
        console.log(`   ✅ OK\n`);
        successCount++;
      } catch (error) {
        console.log(`   ⚠️  ${error.message}\n`);
        errorCount++;
      }
    }

    console.log(`\n🚀 Inicialização concluída!`);
    console.log(`   ✅ ${successCount}/${statements.length} comandos OK`);
    if (errorCount > 0) {
      console.log(`   ⚠️  ${errorCount} erros (normalmente tabelas/índices já existentes)`);
    }
  } catch (error) {
    console.error('❌ Erro de conexão:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runInitDb();
