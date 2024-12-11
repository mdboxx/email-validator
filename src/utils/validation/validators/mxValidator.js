import dns from 'dns';
import { promisify } from 'util';
import { logger } from '../../logger.js';
import { ValidationResult } from '../validationResult.js';

const resolveMx = promisify(dns.resolveMx);

export class MxValidator {
  static async validate(domain) {
    try {
      const records = await resolveMx(domain);
      
      if (!records || records.length === 0) {
        return ValidationResult.failure('No MX records found');
      }

      // Sort by priority (lower is higher priority)
      const sortedRecords = [...records].sort((a, b) => a.priority - b.priority);

      return ValidationResult.success({
        records: sortedRecords,
        primaryMx: sortedRecords[0],
        count: records.length
      });
    } catch (error) {
      logger.error('MX validation error:', error);
      return ValidationResult.failure('MX record validation failed', {
        error: error.message
      });
    }
  }
}