import { Pool } from 'pg';

// Pool = a group of reusable DB connections.
// Without a pool, every request would open AND close a new connection — very slow.
// With a pool of 10, up to 10 requests can query the DB simultaneously.
export const db = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'url_shortener',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 10,                   // maximum connections in the pool
  idleTimeoutMillis: 30000,  // close idle connections after 30s
  connectionTimeoutMillis: 2000, // fail fast if DB is unreachable
});

export const connectDB = async (): Promise<void> => {
  const client = await db.connect();
  console.log('✅ PostgreSQL connected');
  client.release(); // immediately return the connection to the pool
};