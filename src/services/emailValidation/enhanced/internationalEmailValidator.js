import { IDNA } from 'idna-uts46';
import { ValidationResult } from '../../../utils/validation/validationResult.js';
import { logger } from '../../../utils/logger.js';

export class InternationalEmailValidator {
  constructor() {
    this.idna = new IDNA();
  }

  async validate(email) {
    try {
      const [localPart, domain] = email.split('@');

      // Convert domain to ASCII (Punycode)
      const asciiDomain = await this.idna.toASCII(domain);
      
      // Convert local part if it contains Unicode
      const asciiLocalPart = await this.convertLocalPart(localPart);

      const asciiEmail = `${asciiLocalPart}@${asciiDomain}`;
      const unicodeEmail = `${localPart}@${await this.idna.toUnicode(domain)}`;

      return ValidationResult.success({
        ascii: {
          email: asciiEmail,
          localPart: asciiLocalPart,
          domain: asciiDomain
        },
        unicode: {
          email: unicodeEmail,
          localPart,
          domain: await this.idna.toUnicode(domain)
        },
        analysis: {
          containsUnicode: email !== asciiEmail,
          requiresIdna: domain !== asciiDomain
        }
      });
    } catch (error) {
      logger.error('International email validation error:', error);
      return ValidationResult.failure('Invalid international email format');
    }
  }

  private async convertLocalPart(localPart) {
    try {
      // Handle local part according to RFC 6532
      return await this.idna.toASCII(localPart, { allowUnassigned: true });
    } catch (error) {
      logger.error('Local part conversion error:', error);
      return localPart;
    }
  }
}