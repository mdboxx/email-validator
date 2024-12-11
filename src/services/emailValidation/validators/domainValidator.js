import { BaseValidator } from './baseValidator.js';
import { EmailParser } from '../../../utils/validation/emailParser.js';

export class DomainValidator extends BaseValidator {
  constructor() {
    super('DomainValidator');
  }

  async performValidation(email) {
    const parseResult = EmailParser.parse(email);
    if (!parseResult.success) {
      return this.createFailureResult(parseResult.error);
    }

    const { domain } = parseResult;
    const hasValidDomain = domain && 
      /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(domain);

    if (!hasValidDomain) {
      return this.createFailureResult('Invalid domain format', {
        domain,
        requirements: {
          requireTld: true,
          allowUnderscores: false
        }
      });
    }

    const domainParts = domain.split('.');
    return this.createSuccessResult({
      domain,
      tld: domainParts.pop(),
      subdomains: domainParts,
      analysis: {
        length: domain.length,
        parts: domainParts.length + 1
      }
    });
  }
}