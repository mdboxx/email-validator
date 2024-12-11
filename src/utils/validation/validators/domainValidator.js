import { EmailConstants } from '../emailConstants.js';
import { ValidationResult } from '../validationResult.js';
import { logger } from '../../logger.js';

export class DomainValidator {
  static validate(domain) {
    try {
      if (!domain || domain.length > EmailConstants.DOMAIN.MAX_LENGTH) {
        return ValidationResult.failure(EmailConstants.ERRORS.DOMAIN_LENGTH);
      }

      if (!EmailConstants.DOMAIN.PATTERN.test(domain)) {
        return ValidationResult.failure(EmailConstants.ERRORS.INVALID_DOMAIN);
      }

      const domainParts = domain.split('.');
      return ValidationResult.success({
        domain,
        tld: domainParts.pop(),
        subdomains: domainParts,
        analysis: {
          length: domain.length,
          parts: domainParts.length + 1
        }
      });
    } catch (error) {
      logger.error('Domain validation error:', error);
      return ValidationResult.failure('Domain validation error occurred');
    }
  }
}