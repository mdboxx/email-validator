import { promisify } from 'util';
import dns from 'dns';
import { logger } from '../../../../utils/logger.js';

const resolveA = promisify(dns.resolve4);

export class ARecordValidator {
  async validate(domain) {
    try {
      const records = await resolveA(domain);
      return {
        type: 'A',
        records,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.debug(`No A records found for ${domain}`);
      return { type: 'A', records: [] };
    }
  }
}