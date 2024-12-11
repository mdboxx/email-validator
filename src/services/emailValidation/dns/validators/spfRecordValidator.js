import { promisify } from 'util';
import dns from 'dns';
import { logger } from '../../../../utils/logger.js';

const resolveTXT = promisify(dns.resolveTxt);

export class SPFRecordValidator {
  async validate(domain) {
    try {
      const records = await resolveTXT(domain);
      const spfRecords = records
        .flat()
        .filter(record => record.startsWith('v=spf1'));
      
      return {
        type: 'SPF',
        records: spfRecords,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.debug(`No SPF records found for ${domain}`);
      return { type: 'SPF', records: [] };
    }
  }
}