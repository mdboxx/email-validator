import { RateLimiterService } from '../services/rateLimiter/rateLimiterService.js';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

const limiter = new RateLimiterService({
  ip: {
    points: config.rateLimiting.ip.points,
    duration: config.rateLimiting.ip.duration
  },
  apiKey: {
    points: config.rateLimiting.apiKey.points,
    duration: config.rateLimiting.apiKey.duration
  },
  quota: {
    points: config.rateLimiting.quota.points,
    duration: config.rateLimiting.quota.duration
  }
});

export const rateLimiter = async (req, res, next) => {
  try {
    const context = {
      ip: req.ip,
      apiKey: req.headers['x-api-key'],
      quotaKey: req.headers['x-api-key'] || req.ip
    };

    const result = await limiter.tryConsume(context);
    
    if (!result.allowed) {
      logger.warn(`Rate limit exceeded: ${result.reason}`, context);
      return res.status(429).json({
        error: 'Too many requests',
        reason: result.reason
      });
    }

    const limits = await limiter.getRateLimitInfo(context);
    
    res.set('X-RateLimit-Remaining-IP', limits.ip.toString());
    if (limits.apiKey) {
      res.set('X-RateLimit-Remaining-API', limits.apiKey.toString());
    }
    if (limits.quota) {
      res.set('X-RateLimit-Remaining-Quota', limits.quota.toString());
    }

    next();
  } catch (error) {
    logger.error('Rate limiter error:', error);
    next(error);
  }
};