import { RateLimiterFactory } from './rateLimiterFactory.js';
import { logger } from '../../utils/logger.js';

export class RateLimiterService {
  constructor(options = {}) {
    this.limiter = RateLimiterFactory.create(options);
  }

  async tryConsume(key, points = 1) {
    try {
      const allowed = await this.limiter.consume(key, points);
      return {
        allowed,
        remaining: await this.getRemainingPoints(key)
      };
    } catch (error) {
      logger.error('Rate limiting error:', error);
      return {
        allowed: false,
        error: 'Rate limiting error occurred'
      };
    }
  }

  async getRemainingPoints(key) {
    return this.limiter.getRemainingPoints(key);
  }

  async reset(key) {
    return this.limiter.reset(key);
  }
}