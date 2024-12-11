import { ValidationOrchestrator } from './core/index.js';
import { ValidationCache } from '../cache/validationCache.js';
import { RateLimiterService } from '../rateLimiter/index.js';
import { logger } from '../../utils/logger.js';

export class EmailValidationService {
  constructor() {
    this.orchestrator = new ValidationOrchestrator();
    this.cache = new ValidationCache();
    this.rateLimiter = new RateLimiterService();
  }

  async validateEmail(email, options = {}) {
    try {
      // Check cache first
      if (!options.skipCache) {
        const cached = this.cache.get(email);
        if (cached) return cached;
      }

      // Check rate limit
      const canProceed = await this.rateLimiter.tryConsume(email);
      if (!canProceed) {
        return {
          isValid: false,
          errors: ['Rate limit exceeded'],
          metadata: {
            timestamp: new Date().toISOString()
          }
        };
      }

      // Perform validation
      const result = await this.orchestrator.validate(email);

      // Cache successful results
      if (result.isValid && !options.skipCache) {
        this.cache.set(email, result);
      }

      return result;
    } catch (error) {
      logger.error('Email validation error:', error);
      return {
        isValid: false,
        errors: ['Validation process failed'],
        metadata: {
          error: error.message,
          timestamp: new Date().toISOString()
        }
      };
    }
  }
}