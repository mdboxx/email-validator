import { EmailConstants } from '../emailConstants.js';
import { ValidationResult } from '../validationResult.js';

export class FormatRules {
  static validateLocalPartFormat(localPart) {
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

    return ValidationResult.success();
  }

  static validateDomainFormat(domain) {
    if (!EmailConstants.DOMAIN.PATTERN.test(domain)) {
      return ValidationResult.failure(EmailConstants.ERRORS.INVALID_DOMAIN);
    }
    return ValidationResult.success();
  }
}