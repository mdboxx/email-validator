import { RedisRateLimiter } from './strategies/redisStrategy.js';
import { MemoryRateLimiter } from './strategies/memoryStrategy.js';
import { logger } from '../../utils/logger.js';

export class RateLimiterFactory {
  static create(options = {}) {
    try {
      // Check if Redis is available
      if (process.env.REDIS_URL || process.env.REDIS_HOST) {
        logger.info('Using Redis rate limiter');
        return new RedisRateLimiter(options);
      }
      
      logger.info('Using in-memory rate limiter');
      return new MemoryRateLimiter(options);
    } catch (error) {
      logger.error('Error creating rate limiter:', error);
      logger.info('Falling back to in-memory rate limiter');
      return new MemoryRateLimiter(options);
    }
  }
}