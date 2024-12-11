import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redis } from '../../../utils/redis.js';
import { logger } from '../../../utils/logger.js';

export class QuotaRateLimiter {
  constructor(options = {}) {
    this.limiter = new RateLimiterRedis({
      storeClient: redis,
      keyPrefix: 'ratelimit_quota',
      points: options.points || 10000,
      duration: options.duration || 86400, // 24 hours
      blockDuration: options.blockDuration || 86400,
    });
  }

  async consume(key, points = 1) {
    try {
      await this.limiter.consume(key, points);
      return true;
    } catch (error) {
      logger.warn(`Quota exceeded for key: ${key}`);
      return false;
    }
  }

  async getRemainingQuota(key) {
    try {
      const res = await this.limiter.get(key);
      return res ? res.remainingPoints : this.limiter.points;
    } catch (error) {
      logger.error('Error getting remaining quota:', error);
      return 0;
    }
  }
}