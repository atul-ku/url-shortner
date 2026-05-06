import dotenv from 'dotenv';
dotenv.config();

import app from './app';
import { connectDB } from './config/database';
import { redis } from './config/redis';

const PORT = process.env.PORT || 3000;

const start = async (): Promise<void> => {
  try {
    await connectDB();
    // Redis connects automatically when the client is created (in redis.ts).
    // We just log the status via the event listeners defined there.

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running at http://localhost:${PORT}`);
      console.log(`👂 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
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