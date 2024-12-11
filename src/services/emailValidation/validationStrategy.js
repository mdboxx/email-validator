import { SyntaxValidator } from './syntaxValidator.js';
import { DomainValidator } from './domainValidator.js';
import { MxValidator } from './mxValidator.js';
import { SmtpVerifier } from '../smtp/smtpVerifier.js';

export class ValidationStrategy {
  constructor(smtpVerifier) {
    this.smtpVerifier = smtpVerifier;
  }

  async validate(email) {
    const syntaxResult = SyntaxValidator.validate(email);
    if (!syntaxResult.isValid) {
      return syntaxResult;
    }

    const domainResult = DomainValidator.validate(email);
    if (!domainResult.isValid) {
      return domainResult;
    }

    const mxResult = await MxValidator.checkRecords(domainResult.domain);
    if (!mxResult.isValid) {
      return {
        isValid: false,
        errors: ['Invalid MX records'],
        details: { mxRecords: mxResult.records }
      };
    }

    return this.smtpVerifier.verify(email);
  }
}