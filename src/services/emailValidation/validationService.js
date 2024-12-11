import { ValidationStrategy } from './validationStrategy.js';
import { RateLimiterService } from '../rateLimiter/index.js';
import { ValidationResultFormatter } from './resultFormatter.js';
import { ValidationCache } from '../cache/validationCache.js';
import { logger } from '../../utils/logger.js';

export class ValidationService {
  constructor() {
    this.validationStrategy = new ValidationStrategy();
    this.rateLimiter = new RateLimiterService();
    this.cache = new ValidationCache();
  }

  async validateEmail(email) {
    try {
      // Check cache first
      const cachedResult = this.cache.get(email);
      if (cachedResult) {
        return cachedResult;
      }

      // Check rate limit
      const canProceed = await this.rateLimiter.tryConsume(email);
      if (!canProceed) {
        return ValidationResultFormatter.format({
          isValid: false,
          errors: ['Rate limit exceeded']
        }, { email });
      }

      const remainingPoints = await this.rateLimiter.getRemainingPoints(email);
      const result = await this.validationStrategy.validate(email);

      // Cache the result
      const formattedResult = ValidationResultFormatter.format(result, {
        email,
        rateLimit: { remaining: remainingPoints }
      });
      this.cache.set(email, formattedResult);

      return formattedResult;
    } catch (error) {
      logger.error('Email validation error:', error);
      return ValidationResultFormatter.format({
        isValid: false,
        errors: ['Validation process failed'],
        details: { error: error.message }
      }, { email });
    }
  }
}