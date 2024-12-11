import { BaseValidator } from './baseValidator.js';
import { DnsResolver } from '../../../utils/dnsResolver.js';

export class DomainValidator extends BaseValidator {
  constructor() {
    super('domain');
    this.dnsResolver = new DnsResolver();
  }

  protected async performValidation(context) {
    const { email } = context;
    const domain = email.split('@')[1];

    const dnsResult = await this.dnsResolver.resolveDomain(domain);
    if (!dnsResult.exists) {
      return this.createFailureResult('Domain does not exist', dnsResult);
    }

    return this.createSuccessResult({
      domain,
      records: dnsResult.records,
      analysis: dnsResult.analysis
    });
  }
}