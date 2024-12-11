import { ValidationResult } from '../validationResult.js';
import { EmailRules } from '../rules/emailRules.js';
import { logger } from '../../logger.js';

export class LocalPartValidator {
  static validate(email) {
    try {
      const localPart = email.split('@')[0];
      const errors = EmailRules.validateLocalPart(localPart);

      if (errors.length > 0) {
        return ValidationResult.failure(errors);
      }

      return ValidationResult.success({ localPart });
    } catch (error) {
      logger.error('Local part validation error:', error);
      return ValidationResult.failure('Local part validation failed');
    }
  }
}