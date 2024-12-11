import { ValidationResult } from '../validationResult.js';
import { LocalPartValidator } from './localPartValidator.js';
import { DomainValidator } from './domainValidator.js';
import { logger } from '../../logger.js';

export class EmailValidator {
  static async validate(email) {
    try {
      // Validate local part
      const localPartResult = await LocalPartValidator.validate(email);
      if (!localPartResult.isValid) {
        return localPartResult;
      }

      // Validate domain
      const domainResult = await DomainValidator.validate(email);
      if (!domainResult.isValid) {
        return domainResult;
      }

      return ValidationResult.success({
        localPart: localPartResult.details.localPart,
        domain: domainResult.details.domain,
        fullEmail: email
      });
    } catch (error) {
      logger.error('Email validation error:', error);
      return ValidationResult.failure('Email validation failed');
    }
  }
}