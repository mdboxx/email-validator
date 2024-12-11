import { SmtpValidationResult } from './validationResult.js';
import { logger } from '../../../utils/logger.js';

export class SmtpValidationContext {
  constructor(strategy) {
    this.strategy = strategy;
  }

  async validate(email) {
    try {
      const startTime = Date.now();
      const result = await this.strategy.validate(email);
      const endTime = Date.now();

      return {
        ...result,
        metadata: {
          validationTime: endTime - startTime,
          strategy: this.strategy.constructor.name
        }
      };
    } catch (error) {
      logger.error('SMTP validation context error:', error);
      return SmtpValidationResult.failure('Validation context error');
    }
  }

  setStrategy(strategy) {
    this.strategy = strategy;
    return this;
  }
}