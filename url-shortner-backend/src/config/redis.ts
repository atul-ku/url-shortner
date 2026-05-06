import Redis from 'ioredis';

// ioredis automatically reconnects if Redis drops.
// retryStrategy controls the backoff — we wait longer between each retry attempt
// so we don't hammer a recovering Redis server.
export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  retryStrategy: (times) => Math.min(times * 50, 2000), // max 2s between retries
  lazyConnect: false,
});

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', (err) => console.error('❌ Redis error:', err.message));