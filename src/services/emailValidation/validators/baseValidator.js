import { ValidationResult } from '../../../utils/validation/validationResult.js';
import { logger } from '../../../utils/logger.js';

export class BaseValidator {
  constructor(name) {
    this.name = name;
  }

  async validate(context) {
    try {
      const startTime = Date.now();
      const result = await this.performValidation(context);
      const duration = Date.now() - startTime;

      context.metrics.recordValidation(result, duration, this.name);
      return result;
    } catch (error) {
      logger.error(`${this.name} validation error:`, error);
      return ValidationResult.failure(`${this.name} validation failed`);
    }
  }

  async performValidation(context) {
    throw new Error('performValidation must be implemented by subclass');
  }

  createSuccessResult(details = {}) {
    return ValidationResult.success({
      validator: this.name,
      ...details
    });
  }

  createFailureResult(error, details = {}) {
    return ValidationResult.failure(error, {
      validator: this.name,
      ...details
    });
  }
}