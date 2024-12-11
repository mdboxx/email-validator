import { ValidationResult } from '../core/validationResult.js';

export class LengthRules {
  static readonly MAX_LOCAL_PART_LENGTH = 64;
  static readonly MAX_DOMAIN_LENGTH = 255;
  static readonly MAX_TOTAL_LENGTH = 254;

  static validateLocalPartLength(localPart) {
    if (!localPart || localPart.length > this.MAX_LOCAL_PART_LENGTH) {
      return ValidationResult.failure(`Local part exceeds maximum length of ${this.MAX_LOCAL_PART_LENGTH}`);
    }
    return ValidationResult.success();
  }

  static validateDomainLength(domain) {
    if (!domain || domain.length > this.MAX_DOMAIN_LENGTH) {
      return ValidationResult.failure(`Domain exceeds maximum length of ${this.MAX_DOMAIN_LENGTH}`);
    }
    return ValidationResult.success();
  }

  static validateTotalLength(email) {
    if (email.length > this.MAX_TOTAL_LENGTH) {
      return ValidationResult.failure(`Email exceeds maximum length of ${this.MAX_TOTAL_LENGTH}`);
    }
    return ValidationResult.success();
  }
}