import { ValidationResult } from '../../../utils/validation/validationResult.js';
import { logger } from '../../../utils/logger.js';
import { ARecordValidator } from './validators/aRecordValidator.js';
import { AAAARecordValidator } from './validators/aaaaRecordValidator.js';
import { PTRRecordValidator } from './validators/ptrRecordValidator.js';
import { SPFRecordValidator } from './validators/spfRecordValidator.js';

export class EnhancedDnsValidator {
  constructor() {
    this.validators = {
      a: new ARecordValidator(),
      aaaa: new AAAARecordValidator(),
      ptr: new PTRRecordValidator(),
      spf: new SPFRecordValidator()
    };
  }

  async validate(domain) {
    try {
      const results = await Promise.allSettled([
        this.validators.a.validate(domain),
        this.validators.aaaa.validate(domain),
        this.validators.ptr.validate(domain),
        this.validators.spf.validate(domain)
      ]);

      const validations = {
        a: results[0].status === 'fulfilled' ? results[0].value : null,
        aaaa: results[1].status === 'fulfilled' ? results[1].value : null,
        ptr: results[2].status === 'fulfilled' ? results[2].value : null,
        spf: results[3].status === 'fulfilled' ? results[3].value : null
      };

      const isValid = Object.values(validations).some(v => v && v.records.length > 0);

      return isValid
        ? ValidationResult.success(validations)
        : ValidationResult.failure('No valid DNS records found', validations);
    } catch (error) {
      logger.error('Enhanced DNS validation error:', error);
      return ValidationResult.failure('DNS validation failed');
    }
  }
}