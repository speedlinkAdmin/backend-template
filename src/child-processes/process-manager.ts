import { spawn, ChildProcess, exec } from 'child_process';
import { logger } from '../lib/logger';

/**
 * Utility to manage child processes safely
 */
export class ProcessManager {
  private static activeProcesses: Map<number, ChildProcess> = new Map();

  /**
   * Run a shell command and return its output
   */
  static async runCommand(command: string, options: { timeout?: number } = {}): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      const timeout = options.timeout || 60000;
      
      const child = exec(command, { timeout }, (error, stdout, stderr) => {
        if (error) {
          logger.error(`❌ Process failed: ${command}`, { error, stderr });
          reject({ error, stderr, stdout });
          return;
        }
        resolve({ stdout, stderr });
      });

      if (child.pid) {
        this.activeProcesses.set(child.pid, child);
        child.on('exit', () => this.activeProcesses.delete(child.pid!));
      }
    });
  }

  /**
   * Spawn a long-running process
   */
  static spawnProcess(command: string, args: string[] = []): ChildProcess {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true
    });

    if (child.pid) {
      this.activeProcesses.set(child.pid, child);
      logger.info(`🚀 Spawned process [${child.pid}]: ${command} ${args.join(' ')}`);

      child.on('exit', (code) => {
        this.activeProcesses.delete(child.pid!);
        logger.info(`⏹️ Process [${child.pid}] exited with code ${code}`);
      });

      child.on('error', (err) => {
        logger.error(`❌ Process [${child.pid}] error:`, err);
      });
    }

    return child;
  }

  /**
   * Kill all active processes (useful for app shutdown)
   */
  static killAll() {
    logger.info(`Cleaning up ${this.activeProcesses.size} processes...`);
    for (const [pid, child] of this.activeProcesses) {
      child.kill('SIGTERM');
      this.activeProcesses.delete(pid);
    }
  }
}

// Ensure cleanup on app termination
process.on('SIGINT', () => {
  ProcessManager.killAll();
  process.exit();
});

process.on('SIGTERM', () => {
  ProcessManager.killAll();
  process.exit();
});
