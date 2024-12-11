import dns from 'dns';
import { promisify } from 'util';
import { logger } from '../../utils/logger.js';

const resolveMx = promisify(dns.resolveMx);

export class MxValidator {
  /**
   * Check MX records for a domain
   * @param {string} domain Domain to check
   * @returns {Promise<Object>} MX records check result
   */
  static async checkRecords(domain) {
    try {
      const records = await resolveMx(domain);
      return {
        isValid: records.length > 0,
        records: records
      };
    } catch (error) {
      logger.error('MX records check error:', error);
      return {
        isValid: false,
        records: []
      };
    }
  }
}