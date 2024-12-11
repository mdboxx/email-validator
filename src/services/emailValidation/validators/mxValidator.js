import { BaseValidator } from './baseValidator.js';
import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

export class MxValidator extends BaseValidator {
  constructor() {
    super('MxValidator');
  }

  async performValidation(email) {
    const domain = email.split('@')[1];
    const records = await resolveMx(domain);

    if (!records || records.length === 0) {
      return this.createFailureResult('No MX records found', {
        domain
      });
    }

    const sortedRecords = [...records].sort((a, b) => a.priority - b.priority);

    return this.createSuccessResult({
      domain,
      records: sortedRecords,
      primaryMx: sortedRecords[0],
      count: records.length
    });
  }
}