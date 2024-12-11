import { BaseValidationStage } from './BaseValidationStage.js';
import { ValidationResult } from '../results/ValidationResult.js';
import dns from 'dns';
import { promisify } from 'util';

const resolveMx = promisify(dns.resolveMx);

export class DomainValidationStage extends BaseValidationStage {
  constructor() {
    super('domain');
  }

  async validate(context) {
    const domain = context.email.split('@')[1];
    
    try {
      const records = await resolveMx(domain);
      
      if (!records || records.length === 0) {
        return ValidationResult.failure(['No MX records found for domain']);
      }

      return ValidationResult.success({
        domain,
        mxRecords: records.sort((a, b) => a.priority - b.priority)
      });
    } catch (error) {
      return ValidationResult.failure(['Domain validation failed', error.message]);
    }
  }
}