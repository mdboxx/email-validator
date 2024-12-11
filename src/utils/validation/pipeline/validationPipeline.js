import { ValidationResult } from '../validationResult.js';
import { logger } from '../../logger.js';

export class ValidationPipeline {
  constructor(validators = []) {
    this.validators = validators;
  }

  async execute(email) {
    try {
      for (const validator of this.validators) {
        const result = await validator.validate(email);
        if (!result.isValid) {
          return result;
        }
      }

      return ValidationResult.success({
        email,
        validations: this.validators.map(v => v.constructor.name)
      });
    } catch (error) {
      logger.error('Validation pipeline error:', error);
      return ValidationResult.failure('Validation pipeline failed');
    }
  }

  addValidator(validator) {
    this.validators.push(validator);
    return this;
  }

  removeValidator(validatorName) {
    this.validators = this.validators.filter(
      v => v.constructor.name !== validatorName
    );
    return this;
  }
}