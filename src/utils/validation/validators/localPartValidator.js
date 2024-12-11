import { EmailConstants } from '../emailConstants.js';
import { ValidationResult } from '../validationResult.js';
import { logger } from '../../logger.js';

export class LocalPartValidator {
  static validate(localPart) {
    try {
      if (!localPart || localPart.length > EmailConstants.LOCAL_PART.MAX_LENGTH) {
        return ValidationResult.failure(EmailConstants.ERRORS.LOCAL_PART_LENGTH);
      }

      if (localPart.includes('..')) {
        return ValidationResult.failure(EmailConstants.ERRORS.CONSECUTIVE_DOTS);
      }

      if (localPart.startsWith('.')) {
        return ValidationResult.failure(EmailConstants.ERRORS.LEADING_DOT);
      }

      if (localPart.endsWith('.')) {
        return ValidationResult.failure(EmailConstants.ERRORS.TRAILING_DOT);
      }

      if (!EmailConstants.LOCAL_PART.PATTERN.test(localPart)) {
        return ValidationResult.failure(EmailConstants.ERRORS.INVALID_CHARS);
      }

      return ValidationResult.success({ localPart });
    } catch (error) {
      logger.error('Local part validation error:', error);
      return ValidationResult.failure('Local part validation error occurred');
    }
  }
}