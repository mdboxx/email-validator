import Redis from 'ioredis';
import { logger } from './logger.js';

const createRedisClient = () => {
  const client = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    retryStrategy: (times) => {
      const delay = Math.min(times * 50, 2000);
      logger.warn(`Redis reconnection attempt ${times} in ${delay}ms`);
      return delay;
    },
    maxRetriesPerRequest: 3
  });

  client.on('error', (error) => {
    logger.error('Redis connection error:', error);
  });

  client.on('connect', () => {
    logger.info('Redis connected successfully');
  });

  return client;
};

export const redis = createRedisClient();