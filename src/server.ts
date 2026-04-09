import '@configs/env.config';
import { app } from './app';
import { logger } from './lib/logger';
import { prisma } from './lib/prisma';
import { redis } from './lib/redis';
import './workers/worker-runner';
import './crons/cron-runner';
import { initSocket } from '@lib/socket';
import http from 'http';

const PORT = env.PORT;

async function startServer() {
  try {
    const server = http.createServer(app);

    // Initialize Socket.io (must be before server.listen)
    initSocket(server);

    await prisma.$connect();
    logger.info('✅ Database connected');

    await redis.ping();
    logger.info('✅ Redis connected');

    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });

    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down...`);

      server.close(async () => {
        await prisma.$disconnect();
        await redis.quit();
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Forceful shutdown');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

