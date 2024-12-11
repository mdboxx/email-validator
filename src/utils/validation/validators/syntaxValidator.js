import { EmailParser } from '../emailParser.js';
import { LengthRules, FormatRules } from '../rules/index.js';
import { ValidationResult } from '../validationResult.js';
import { logger } from '../../logger.js';

export class SyntaxValidator {
  static validate(email) {
    try {
      const parseResult = EmailParser.parse(email);
      if (!parseResult.success) {
        return ValidationResult.failure(parseResult.error);
      }

      const { localPart, domain } = parseResult;

      // Check lengths
      const localPartLengthResult = LengthRules.validateLocalPartLength(localPart);
      if (!localPartLengthResult.isValid) {
        return localPartLengthResult;
      }

      const domainLengthResult = LengthRules.validateDomainLength(domain);
      if (!domainLengthResult.isValid) {
        return domainLengthResult;
      }

      // Check formats
      const localPartFormatResult = FormatRules.validateLocalPartFormat(localPart);
      if (!localPartFormatResult.isValid) {
        return localPartFormatResult;
      }

      const domainFormatResult = FormatRules.validateDomainFormat(domain);
      if (!domainFormatResult.isValid) {
        return domainFormatResult;
      }

      return ValidationResult.success({
        localPart,
        domain,
        fullEmail: email
      });
    } catch (error) {
      logger.error('Syntax validation error:', error);
      return ValidationResult.failure('Syntax validation failed');
    }
  }
}