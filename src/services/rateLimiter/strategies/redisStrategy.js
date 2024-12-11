import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redis } from '../../../utils/redis.js';
import { logger } from '../../../utils/logger.js';

export class RedisRateLimiter {
  constructor(options = {}) {
    this.limiter = new RateLimiterRedis({
      storeClient: redis,
      keyPrefix: 'ratelimit',
      points: options.points || 10,
      duration: options.duration || 1,
      blockDuration: options.blockDuration || 60
    });
  }

  async consume(key, points = 1) {
    try {
      await this.limiter.consume(key, points);
      return true;
    } catch (error) {
      logger.debug(`Rate limit exceeded for key: ${key}`);
      return false;
    }
  }

  async getRemainingPoints(key) {
    try {
      const res = await this.limiter.get(key);
      return res ? res.remainingPoints : this.limiter.points;
    } catch (error) {
      logger.error('Error getting remaining points:', error);
      return 0;
    }
  }

  async reset(key) {
    try {
      await this.limiter.delete(key);
      return true;
    } catch (error) {
      logger.error('Error resetting rate limit:', error);
      return false;
    }
  }
}