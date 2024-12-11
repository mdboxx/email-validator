import { promisify } from 'util';
import dns from 'dns';
import { logger } from '../../../../utils/logger.js';

const resolvePTR = promisify(dns.resolvePtr);

export class PTRRecordValidator {
  async validate(domain) {
    try {
      const records = await resolvePTR(domain);
      return {
        type: 'PTR',
        records,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.debug(`No PTR records found for ${domain}`);
      return { type: 'PTR', records: [] };
    }
  }
}