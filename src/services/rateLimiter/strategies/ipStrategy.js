import { RateLimiterMemory } from 'rate-limiter-flexible';
import { logger } from '../../../utils/logger.js';

export class IpRateLimiter {
  constructor(options = {}) {
    this.limiter = new RateLimiterMemory({
      points: options.points || 100,
      duration: options.duration || 3600,
      blockDuration: options.blockDuration || 1800,
    });
  }

  async consume(ip) {
    try {
      await this.limiter.consume(ip);
      return true;
    } catch (error) {
      logger.warn(`IP rate limit exceeded for IP: ${ip}`);
      return false;
    }
  }

  async getRemainingPoints(ip) {
    try {
      const res = await this.limiter.get(ip);
      return res ? res.remainingPoints : this.limiter.points;
    } catch (error) {
      logger.error('Error getting remaining points:', error);
      return 0;
    }
  }
}