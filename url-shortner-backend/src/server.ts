// Load environment variables FIRST before any other imports.
// dotenv reads .env and populates process.env so that all other
// modules (database.ts, redis.ts, etc.) can access them at import time.
import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/database';
import { redis } from './config/redis';

const PORT = process.env.PORT || 3000;

const start = async (): Promise<void> => {
  try {
    // Verify DB is reachable before accepting any traffic.
    // If the DB is down, we exit early rather than serving broken requests.
    await connectDB();

    // Redis connects automatically when the client is created (in redis.ts).
    // We just log the status via the event listeners defined there.

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running at http://localhost:${PORT}`);
      console.log(`❤️  Health check: http://localhost:${PORT}/health`);
      console.log(`📎 Shorten URL:   POST http://localhost:${PORT}/api/shorten`);
      console.log(`↗️  Redirect:      GET  http://localhost:${PORT}/:code\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    // process.exit(1) tells the OS / Docker / Kubernetes the process failed.
    // This triggers a container restart in production.
    process.exit(1);
  }
};

// Handle unhandled promise rejections (bugs you forgot to catch)
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});

// Graceful shutdown — close DB connections properly before the process dies
process.on('SIGTERM', async () => {
  console.log('SIGTERM received — shutting down gracefully');
  await redis.quit();
  process.exit(0);
});

start();