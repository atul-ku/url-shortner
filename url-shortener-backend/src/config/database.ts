import { Pool } from 'pg';

export const db = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'url_shortener',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 10,                  
  idleTimeoutMillis: 30000, 
  connectionTimeoutMillis: 2000, 
});

export const connectDB = async (): Promise<void> => {
  const client = await db.connect();
  console.log('✅ PostgreSQL connected');
  client.release();
};