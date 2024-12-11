import { promisify } from 'util';
import dns from 'dns';
import { logger } from '../../../../utils/logger.js';

const resolveAAAA = promisify(dns.resolve6);

export class AAAARecordValidator {
  async validate(domain) {
    try {
      const records = await resolveAAAA(domain);
      return {
        type: 'AAAA',
        records,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.debug(`No AAAA records found for ${domain}`);
      return { type: 'AAAA', records: [] };
    }
  }
}