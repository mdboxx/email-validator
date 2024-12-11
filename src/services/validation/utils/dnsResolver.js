import dns from 'dns';
import { promisify } from 'util';
import { logger } from '../../../utils/logger.js';

const resolveMx = promisify(dns.resolveMx);
const resolve4 = promisify(dns.resolve4);
const resolve6 = promisify(dns.resolve6);

export class DnsResolver {
  async resolveDomain(domain) {
    try {
      const [mxRecords, aRecords, aaaaRecords] = await Promise.all([
        this.resolveMxRecords(domain),
        this.resolveARecords(domain),
        this.resolveAaaaRecords(domain)
      ]);

      const exists = mxRecords.length > 0 || aRecords.length > 0 || aaaaRecords.length > 0;

      return {
        exists,
        records: {
          mx: mxRecords,
          a: aRecords,
          aaaa: aaaaRecords
        },
        analysis: {
          hasMx: mxRecords.length > 0,
          hasIpv4: aRecords.length > 0,
          hasIpv6: aaaaRecords.length > 0
        }
      };
    } catch (error) {
      logger.error('DNS resolution error:', error);
      return {
        exists: false,
        records: {},
        error: error.message
      };
    }
  }

  private async resolveMxRecords(domain) {
    try {
      return await resolveMx(domain);
    } catch {
      return [];
    }
  }

  private async resolveARecords(domain) {
    try {
      return await resolve4(domain);
    } catch {
      return [];
    }
  }

  private async resolveAaaaRecords(domain) {
    try {
      return await resolve6(domain);
    } catch {
      return [];
    }
  }
}