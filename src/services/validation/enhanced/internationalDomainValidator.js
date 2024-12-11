import { IDNA } from 'idna-uts46';
import { DomainParser } from 'domain-parser';
import { logger } from '../../../utils/logger.js';

export class InternationalDomainValidator {
  constructor() {
    this.parser = new DomainParser();
    this.idna = new IDNA();
  }

  async validate(domain) {
    try {
      // Convert to ASCII if needed
      const asciiDomain = await this.idna.toASCII(domain);
      
      // Parse domain components
      const parsed = this.parser.parse(asciiDomain);
      
      if (!parsed.isValid) {
        return {
          isValid: false,
          errors: parsed.errors,
          details: {
            original: domain,
            ascii: asciiDomain
          }
        };
      }

      // Validate TLD
      const tldValidation = await this.validateTLD(parsed.tld);
      if (!tldValidation.isValid) {
        return {
          isValid: false,
          errors: ['Invalid TLD'],
          details: tldValidation.details
        };
      }

      return {
        isValid: true,
        details: {
          original: domain,
          ascii: asciiDomain,
          unicode: await this.idna.toUnicode(asciiDomain),
          components: {
            tld: parsed.tld,
            sld: parsed.sld,
            subdomains: parsed.subdomains
          }
        }
      };
    } catch (error) {
      logger.error('International domain validation error:', error);
      return {
        isValid: false,
        errors: ['Domain validation failed'],
        details: { error: error.message }
      };
    }
  }

  private async validateTLD(tld) {
    try {
      // Implement TLD validation logic
      return { isValid: true };
    } catch (error) {
      logger.error('TLD validation error:', error);
      return { isValid: false, details: { error: error.message } };
    }
  }
}