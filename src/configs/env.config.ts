import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Extend the globalThis type to include our env property
declare global {
  var env: z.infer<typeof envSchema>;
}

export const envSchema = z.object({
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  CLIENT_URL: z.string().default('http://localhost:3000'),
 
  // Database
  DATABASE_URL: z.string().default(''),

  // Redis (Railway provides REDIS_URL)
  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  
  // Queue settings
  QUEUE_CONCURRENCY: z.string().default('5'),
  QUEUE_ATTEMPTS: z.string().default('3'),
  
  // Email
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  EMAIL_FROM: z.string(),
  
  // App
  APP_NAME: z.string().default('My App'),
  APP_URL: z.string().default('http://localhost:3000'),

  JWT_SECRET: z.string().default('your-secret-key'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_ROUNDS: z.string().default('10'),

  LOG_LEVEL: z.string().default('info'),
  RATE_LIMIT_WINDOW_MS: z.number().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.number().default(100),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),

  // AWS
  AWS_REGION: z.string().default('us-east-1'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),

});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error('❌ Invalid environment variables:', parsedEnv.error.format());
  process.exit(1);
}


// Export the env property
export const env = parsedEnv.data;
globalThis.env = env;
