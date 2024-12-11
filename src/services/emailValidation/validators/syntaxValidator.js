import { BaseValidator } from './baseValidator.js';
import { EmailParser } from '../../../utils/validation/emailParser.js';
import { EmailRules } from '../../../utils/validation/emailRules.js';

export class SyntaxValidator extends BaseValidator {
  constructor() {
    super('SyntaxValidator');
  }

  async performValidation(email) {
    const parseResult = EmailParser.parse(email);
    if (!parseResult.success) {
      return this.createFailureResult(parseResult.error);
    }

    const { localPart, domain } = parseResult;
    const errors = EmailRules.getValidationErrors(localPart, domain);

    if (errors.length > 0) {
      return this.createFailureResult(errors, {
        localPart,
        domain,
        rules: {
          maxLocalPartLength: EmailRules.MAX_LOCAL_PART_LENGTH,
          maxDomainLength: EmailRules.MAX_DOMAIN_LENGTH,
          maxTotalLength: EmailRules.MAX_TOTAL_LENGTH
        }
      });
    }

    return this.createSuccessResult({
      localPart,
      domain,
      fullEmail: email
    });
  }
}