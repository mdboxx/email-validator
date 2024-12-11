import { ValidationStrategy } from '../strategies/validationStrategy.js';
import { RateLimiterService } from '../../rateLimiter/index.js';
import { ValidationResultFormatter } from '../formatters/resultFormatter.js';
import { ValidationCache } from '../../cache/validationCache.js';
import { ValidationState } from './validationState.js';
import { ValidationOptions } from './validationOptions.js';
import { logger } from '../../../utils/logger.js';

export class EmailValidationService {
  constructor() {
    this.validationStrategy = new ValidationStrategy();
    this.rateLimiter = new RateLimiterService();
    this.cache = new ValidationCache();
  }

  async validateEmail(email, options = {}) {
    const validationOptions = new ValidationOptions(options);
    const state = new ValidationState();

    try {
      if (!validationOptions.skipCache) {
        const cachedResult = this.cache.get(email);
        if (cachedResult && !validationOptions.forceFresh) {
          return cachedResult;
        }
      }

      const canProceed = await this.rateLimiter.tryConsume(email);
      if (!canProceed) {
        return ValidationResultFormatter.format({
          isValid: false,
          errors: ['Rate limit exceeded']
        }, { email });
      }

      const remainingPoints = await this.rateLimiter.getRemainingPoints(email);
      const result = await this.validationStrategy.validate(email, state);

      const formattedResult = ValidationResultFormatter.format(result, {
        email,
        rateLimit: { remaining: remainingPoints },
        metrics: state.getMetrics()
      });

      if (result.isValid && !validationOptions.skipCache) {
        this.cache.set(email, formattedResult);
      }

      return formattedResult;
    } catch (error) {
      logger.error('Email validation error:', error);
      state.addError(error);
      
      return ValidationResultFormatter.format({
        isValid: false,
        errors: ['Validation process failed'],
        details: { error: error.message }
      }, { 
        email,
        metrics: state.getMetrics()
      });
    }
  }
}