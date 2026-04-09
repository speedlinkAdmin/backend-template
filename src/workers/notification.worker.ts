import { Worker } from 'bullmq';
import { redis } from '../lib/redis';
import { sendEmail } from '../lib/email';
import { logger } from '../lib/logger';

export const emailWorker = new Worker('email', async (job) => {
  const { to, subject, html } = job.data;
  
  logger.info(`Processing email job ${job.id}`, { to });
  
  await sendEmail(to, subject, html);
  
  return { success: true, to };
}, {
  connection: redis,
  concurrency: 5,
});

emailWorker.on('completed', (job) => {
  logger.info(`Email job ${job?.id} completed`);
});

emailWorker.on('failed', (job, err) => {
  logger.error(`Email job ${job?.id} failed:`, err);
});