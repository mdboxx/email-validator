import { ValidationResult } from '../core/validationResult.js';
import { logger } from '../../logger.js';

export class SyntaxRules {
  static readonly ALLOWED_SPECIAL_CHARS = '!#$%&\'*+-/=?^_`{|}~.';
  static readonly LOCAL_PART_PATTERN = new RegExp(
    `^[a-zA-Z0-9${this.ALLOWED_SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+$`
  );

  static validateLocalPart(localPart) {
    try {
      if (localPart.includes('..')) {
        return ValidationResult.failure('Local part contains consecutive dots');
      }

      if (localPart.startsWith('.') || localPart.endsWith('.')) {
        return ValidationResult.failure('Local part cannot start or end with a dot');
      }

      if (!this.LOCAL_PART_PATTERN.test(localPart)) {
        return ValidationResult.failure('Local part contains invalid characters');
      }

      return ValidationResult.success({ localPart });
    } catch (error) {
      logger.error('Local part syntax validation error:', error);
      return ValidationResult.failure('Syntax validation failed');
    }
  }
}