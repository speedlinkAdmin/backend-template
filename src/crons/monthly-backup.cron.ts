import cron from 'node-cron';
import { ProcessManager } from '../child-processes/process-manager';
import { logger } from '../lib/logger';
import { env } from '../configs/env.config';
import path from 'path';
import fs from 'fs';

/**
 * Task: Monthly Database Backup
 */
export async function runBackupJob() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupDir = path.resolve(process.cwd(), 'backups');
  const fileName = `backup-${timestamp}.sql`;
  const filePath = path.join(backupDir, fileName);

  logger.info(`💾 Starting database backup to ${filePath}...`);

  // Create backups directory if it doesn't exist
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  try {
    // Example: pg_dump for PostgreSQL
    // In a real app, you'd pull credentials from env
    const dbUrl = env.DATABASE_URL;
    
    // Safety check: Don't run if no DB URL found
    if (!dbUrl) {
      throw new Error('DATABASE_URL is not defined in environment config');
    }

    // Command template: pg_dump --dbname=url --file=path
    const backupCommand = `pg_dump "${dbUrl}" --file="${filePath}" --no-password`;

    const { stderr } = await ProcessManager.runCommand(backupCommand, {
      timeout: 300000, // 5 minute timeout for large DBs
    });

    if (stderr && !stderr.includes('warning')) {
      logger.warn('⚠️ Backup process handled with warnings:', stderr);
    }

    logger.info(`✅ Backup completed successfully: ${fileName}`);
    
    // Optional: Upload to S3 if AWS is configured
    // await uploadToS3(filePath);

    return { success: true, file: filePath };
  } catch (error) {
    logger.error('❌ Database backup failed:', error);
    throw error;
  }
}

// Schedule the job to run at 00:00 on the 1st day of every month
cron.schedule('0 0 1 * *', async () => {
  logger.info('⏰ Running scheduled monthly database backup cron...');
  try {
    await runBackupJob();
  } catch (error) {
    logger.error('❌ Scheduled monthly backup cron failed:', error);
  }
});
