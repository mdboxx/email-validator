import { ValidationResult } from '../../../utils/validation/validationResult.js';
import { logger } from '../../../utils/logger.js';
import disposableDomains from 'disposable-email-domains';

export class TemporaryEmailDetector {
  constructor() {
    this.disposableDomains = new Set(disposableDomains);
    this.temporaryServicePatterns = [
      /temp(mail|email)/i,
      /disposable/i,
      /throwaway/i,
      /trash-?mail/i,
      /yopmail/i,
      /guerrilla/i,
      /10minute/i
    ];
  }

  detect(email) {
    try {
      const domain = email.split('@')[1].toLowerCase();

      // Check against known disposable domains
      if (this.disposableDomains.has(domain)) {
        return ValidationResult.failure('Known temporary email service', {
          domain,
          type: 'disposable-list'
        });
      }

      // Check against patterns
      for (const pattern of this.temporaryServicePatterns) {
        if (pattern.test(domain)) {
          return ValidationResult.failure('Temporary email pattern detected', {
            domain,
            pattern: pattern.toString(),
            type: 'pattern-match'
          });
        }
      }

      return ValidationResult.success({
        domain,
        isTemporary: false
      });
    } catch (error) {
      logger.error('Temporary email detection error:', error);
      return ValidationResult.failure('Temporary email detection failed');
    }
  }

  addPattern(pattern) {
    if (pattern instanceof RegExp) {
      this.temporaryServicePatterns.push(pattern);
    } else {
      this.temporaryServicePatterns.push(new RegExp(pattern, 'i'));
    }
  }

  addDisposableDomain(domain) {
    this.disposableDomains.add(domain.toLowerCase());
  }
}