import { RateLimiterRedis } from 'rate-limiter-flexible';
import { redis } from '../../../utils/redis.js';
import { logger } from '../../../utils/logger.js';

export class ApiKeyRateLimiter {
  constructor(options = {}) {
    this.limiter = new RateLimiterRedis({
      storeClient: redis,
      keyPrefix: 'ratelimit_apikey',
      points: options.points || 1000,
      duration: options.duration || 3600,
      blockDuration: options.blockDuration || 3600,
    });
  }

  async consume(apiKey) {
    try {
      await this.limiter.consume(apiKey);
      return true;
    } catch (error) {
      logger.warn(`API key rate limit exceeded for key: ${apiKey}`);
      return false;
    }
  }

  async getRemainingPoints(apiKey) {
    try {
      const res = await this.limiter.get(apiKey);
      return res ? res.remainingPoints : this.limiter.points;
    } catch (error) {
      logger.error('Error getting remaining points:', error);
      return 0;
    }
  }
}