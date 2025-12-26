import pkg from 'pg';
import { DATABASE_URL } from '../config/config';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: DATABASE_URL,
});

pool.on('error', (err) => {
  console.error('Erro não esperado no pool de conexões', err);
});

export default pool;

