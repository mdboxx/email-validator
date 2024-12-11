import { ValidationResult } from '../../../validationResult.js';
import { EmailRules } from '../../../rules/emailRules.js';
import { logger } from '../../../../logger.js';

export class EmailFormatValidator {
  static validate(email) {
    try {
      if (!email || typeof email !== 'string') {
        return ValidationResult.failure('Invalid email input');
      }

      const parts = email.split('@');
      if (parts.length !== 2) {
        return ValidationResult.failure('Invalid email format');
      }

      const [localPart, domain] = parts;
      const localPartErrors = EmailRules.validateLocalPart(localPart);
      const domainErrors = EmailRules.validateDomain(domain);

      const errors = [...localPartErrors, ...domainErrors];
      if (errors.length > 0) {
        return ValidationResult.failure(errors);
      }

      return ValidationResult.success({
        localPart,
        domain,
        analysis: {
          length: email.length,
          hasSpecialChars: /[!#$%&'*+-/=?^_`{|}~.]/.test(localPart)
        }
      });
    } catch (error) {
      logger.error('Email format validation error:', error);
      return ValidationResult.failure('Format validation failed');
    }
  }
}