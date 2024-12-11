import { ValidationResult } from '../core/validationResult.js';
import { logger } from '../../logger.js';

export class DomainRules {
  static readonly DOMAIN_PATTERN = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  static validateDomain(domain) {
    try {
      if (!this.DOMAIN_PATTERN.test(domain)) {
        return ValidationResult.failure('Invalid domain format');
      }

      const parts = domain.split('.');
      if (parts.length < 2) {
        return ValidationResult.failure('Domain must have at least one subdomain');
      }

      return ValidationResult.success({
        domain,
        tld: parts[parts.length - 1],
        subdomains: parts.slice(0, -1)
      });
    } catch (error) {
      logger.error('Domain validation error:', error);
      return ValidationResult.failure('Domain validation failed');
    }
  }
}