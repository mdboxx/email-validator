import validator from 'validator';
import { logger } from '../../utils/logger.js';
import { EmailParser } from '../../utils/validation/emailParser.js';
import { ValidationResult } from '../../utils/validation/validationResult.js';

export class DomainValidator {
  static validate(email) {
    try {
      const parseResult = EmailParser.parse(email);
      if (!parseResult.success) {
        return ValidationResult.failure(parseResult.error);
      }

      const { domain } = parseResult;
      const hasValidDomain = domain && 
        validator.isFQDN(domain, {
          require_tld: true,
          allow_underscores: false
        });

      if (!hasValidDomain) {
        return ValidationResult.failure('Invalid domain format', {
          domain,
          requirements: {
            requireTld: true,
            allowUnderscores: false
          }
        });
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