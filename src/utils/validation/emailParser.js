import { logger } from '../logger.js';

export class EmailParser {
  static parse(email) {
    try {
      if (!email || typeof email !== 'string') {
        return {
          success: false,
          localPart: null,
          domain: null,
          error: 'Invalid email input'
        };
      }

      const parts = email.split('@');
      if (parts.length !== 2) {
        return {
          success: false,
          localPart: null,
          domain: null,
          error: 'Invalid email format'
        };
      }

      const [localPart, domain] = parts;
      return {
        success: true,
        localPart,
        domain,
        error: null
      };
    } catch (error) {
      logger.error('Email parsing error:', error);
      return {
        success: false,
        localPart: null,
        domain: null,
        error: 'Email parsing failed'
      };
    }
  }
}