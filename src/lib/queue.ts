import { Queue } from 'bullmq';
import { redis } from './redis';

export const emailQueue = new Queue('email', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});

export const notificationQueue = new Queue('notification', {
  connection: redis,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'fixed', delay: 5000 },
  },
});

export async function getQueueStats() {
  const queues = { email: emailQueue, notification: notificationQueue };
  const stats: Record<string, any> = {};
  
  for (const [name, queue] of Object.entries(queues)) {
    stats[name] = {
      waiting: await queue.getWaitingCount(),
      active: await queue.getActiveCount(),
      completed: await queue.getCompletedCount(),
      failed: await queue.getFailedCount(),
      delayed: await queue.getDelayedCount(),
    };
  }
  
  return stats;
}