import { BaseValidationStage } from './BaseValidationStage.js';
import { ValidationResult } from '../results/ValidationResult.js';
import { SmtpVerifier } from '../../smtp/smtpVerifier.js';

export class SmtpValidationStage extends BaseValidationStage {
  constructor() {
    super('smtp');
    this.smtpVerifier = new SmtpVerifier();
  }

  async validate(context) {
    try {
      const result = await this.smtpVerifier.verify(context.email);
      
      if (!result.isValid) {
        return ValidationResult.failure(['SMTP verification failed', ...result.errors]);
      }

      return ValidationResult.success({
        smtp: result.details
      });
    } catch (error) {
      return ValidationResult.failure(['SMTP validation error', error.message]);
    }
  }
}