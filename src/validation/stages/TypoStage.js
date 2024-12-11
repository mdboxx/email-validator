import { BaseStage } from './BaseStage.js';
import { ValidationResult } from '../results/ValidationResult.js';
import { TypoDetector } from '../utils/TypoDetector.js';
import { logger } from '../../utils/logger.js';

export class TypoStage extends BaseStage {
  constructor() {
    super('typo');
    this.detector = new TypoDetector();
  }

  async validate(context) {
    try {
      const { email } = context;
      const [localPart, domain] = email.split('@');

      const typos = this.detector.findTypos(localPart, domain);
      const suggestions = this.detector.getSuggestions(email);

      if (typos.length > 0) {
        return ValidationResult.failure('Potential typos detected', {
          typos,
          suggestions
        });
      }

      return ValidationResult.success({
        typoCheck: {
          hasTypos: false,
          suggestions
        }
      });
    } catch (error) {
      logger.error('Typo detection error:', error);
      return ValidationResult.failure('Typo detection failed');
    }
  }
}