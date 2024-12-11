import { BaseValidator } from './baseValidator.js';
import { EmailRules } from '../../../rules/emailRules.js';

export class SyntaxValidator extends BaseValidator {
  constructor() {
    super('syntax');
  }

  protected async performValidation(context) {
    const { email } = context;
    const [localPart, domain] = email.split('@');

    if (!localPart || !domain) {
      return this.createFailureResult('Invalid email format');
    }

    const errors = [
      ...EmailRules.validateLocalPart(localPart),
      ...EmailRules.validateDomain(domain)
    ];

    if (errors.length > 0) {
      return this.createFailureResult(errors);
    }

    return this.createSuccessResult({
      localPart,
      domain,
      analysis: {
        length: email.length,
        hasSpecialChars: EmailRules.hasSpecialCharacters(localPart)
      }
    });
  }
}