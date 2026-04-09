import "@crons/monthly-backup.cron";
import { logger } from '@lib/logger';

logger.info('🚀 All crons started');

process.on('SIGTERM', async () => {
  logger.info('Shutting down crons...');
  process.exit(0);
});

