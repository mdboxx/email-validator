import validator from 'validator';
import { logger } from '../../utils/logger.js';
import { EmailParser } from '../../utils/validation/emailParser.js';
import { EmailRules } from '../../utils/validation/emailRules.js';
import { ValidationResult } from '../../utils/validation/validationResult.js';

export class SyntaxValidator {
  static validate(email) {
    try {
      const parseResult = EmailParser.parse(email);
      if (!parseResult.success) {
        return ValidationResult.failure(parseResult.error);
      }

      const { localPart, domain } = parseResult;
      const errors = EmailRules.getValidationErrors(localPart, domain);
      
      if (errors.length > 0) {
        return ValidationResult.failure(errors, {
          localPart,
          domain,
          rules: {
            maxLocalPartLength: EmailRules.MAX_LOCAL_PART_LENGTH,
            maxDomainLength: EmailRules.MAX_DOMAIN_LENGTH,
            maxTotalLength: EmailRules.MAX_TOTAL_LENGTH
          }
        });
      }

      const isValid = validator.isEmail(email, {
        allow_utf8_local_part: false,
        require_tld: true
      });

      return isValid
        ? ValidationResult.success({ localPart, domain })
        : ValidationResult.failure('Invalid email format', { localPart, domain });
    } catch (error) {
      logger.error('Email syntax validation error:', error);
      return ValidationResult.failure('Validation error occurred');
    }
  }
}