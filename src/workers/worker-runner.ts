import './email.worker';
import './notification.worker';
import { logger } from '../lib/logger';

logger.info('🚀 All workers started and waiting for jobs...');

process.on('SIGTERM', async () => {
  logger.info('Shutting down workers...');
  process.exit(0);
});