import { ValidationResult } from '../validationResult.js';
import { EmailRules } from '../rules/emailRules.js';
import { logger } from '../../logger.js';

export class DomainValidator {
  static validate(email) {
    try {
      const domain = email.split('@')[1];
      const errors = EmailRules.validateDomain(domain);

      if (errors.length > 0) {
        return ValidationResult.failure(errors);
      }

      return ValidationResult.success({
        domain,
        parts: domain.split('.'),
        tld: domain.split('.').pop()
      });
    } catch (error) {
      logger.error('Domain validation error:', error);
      return ValidationResult.failure('Domain validation failed');
    }
  }
}