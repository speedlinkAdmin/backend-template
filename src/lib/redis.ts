import Redis from 'ioredis';
import { logger } from './logger';

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined;
};

function createRedisClient(): Redis {
  const redisUrl = env.REDIS_URL;
  
  if (redisUrl) {
    return new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        logger.warn(`Redis reconnecting... attempt ${times}, delay: ${delay}ms`);
        return delay;
      },
    });
  }
  
  return new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
  });
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redis = redis;
}

redis.on('connect', () => logger.info('Redis connected'));
redis.on('error', (error) => logger.error('Redis error:', error));

export async function getCache<T>(key: string): Promise<T | null> {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
}

export async function setCache(key: string, value: any, ttl?: number): Promise<void> {
  const stringValue = JSON.stringify(value);
  if (ttl) {
    await redis.setex(key, ttl, stringValue);
  } else {
    await redis.set(key, stringValue);
  }
}