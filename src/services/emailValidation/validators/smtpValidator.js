import { BaseValidator } from './baseValidator.js';
import { SmtpVerifier } from '../../smtp/smtpVerifier.js';

export class SmtpValidator extends BaseValidator {
  constructor() {
    super('SmtpValidator');
    this.smtpVerifier = new SmtpVerifier();
  }

  async performValidation(email) {
    const result = await this.smtpVerifier.verify(email);
    
    return result.isValid
      ? this.createSuccessResult(result.details)
      : this.createFailureResult('SMTP verification failed', result.details);
  }
}