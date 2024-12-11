import { BaseStage } from './BaseStage.js';
import { EmailRules } from '../rules/EmailRules.js';
import { ValidationResult } from '../results/ValidationResult.js';
import { logger } from '../../utils/logger.js';

export class SyntaxStage extends BaseStage {
  constructor() {
    super('syntax');
  }

  async validate(context) {
    try {
      const { email } = context;
      const [localPart, domain] = email.split('@');

      if (!localPart || !domain) {
        return ValidationResult.failure('Invalid email format');
      }

      const errors = [
        ...EmailRules.validateLocalPart(localPart),
        ...EmailRules.validateDomain(domain)
      ];

      if (errors.length > 0) {
        return ValidationResult.failure(errors);
      }

      return ValidationResult.success({
        localPart,
        domain,
        analysis: {
          length: email.length,
          hasSpecialChars: EmailRules.hasSpecialCharacters(localPart)
        }
      });
    } catch (error) {
      logger.error('Syntax validation error:', error);
      return ValidationResult.failure('Syntax validation failed');
    }
  }
}