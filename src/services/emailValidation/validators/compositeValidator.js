import { SyntaxValidator } from './syntaxValidator.js';
import { DomainValidator } from './domainValidator.js';
import { MxValidator } from './mxValidator.js';
import { ValidationResult } from '../../../utils/validation/validationResult.js';
import { logger } from '../../../utils/logger.js';

export class CompositeValidator {
  static async validate(email) {
    try {
      // Syntax validation
      const syntaxResult = SyntaxValidator.validate(email);
      if (!syntaxResult.isValid) {
        return syntaxResult;
      }

      // Domain validation
      const domainResult = DomainValidator.validate(email);
      if (!domainResult.isValid) {
        return domainResult;
      }

      // MX validation
      const mxResult = await MxValidator.validate(domainResult.details.domain);
      if (!mxResult.isValid) {
        return mxResult;
      }

      return ValidationResult.success({
        syntax: syntaxResult.details,
        domain: domainResult.details,
        mx: mxResult.details
      });
    } catch (error) {
      logger.error('Composite validation error:', error);
      return ValidationResult.failure('Validation process failed');
    }
  }
}