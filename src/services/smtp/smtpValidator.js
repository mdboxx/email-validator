import { SmtpConnectionManager } from './connectionManager.js';
import { logger } from '../../utils/logger.js';

export class SmtpValidator {
  /**
   * Verify email through SMTP connection
   * @param {string} email Email to verify
   * @param {Object} server SMTP server configuration
   * @returns {Promise<Object>} Verification result
   */
  static async verify(email, server) {
    try {
      const transport = SmtpConnectionManager.createConnection(server);
      
      const connectionValid = await SmtpConnectionManager.testConnection(server);
      if (!connectionValid) {
        throw new Error('SMTP connection failed');
      }

      const result = await SmtpConnectionManager.verifyRecipient(transport, email);
      return {
        isValid: result.isValid,
        errors: result.isValid ? [] : ['SMTP verification failed'],
        details: { smtp: result.details }
      };
    } catch (error) {
      logger.error('SMTP verification error:', error);
      return {
        isValid: false,
        errors: ['SMTP verification failed'],
        details: { error: error.message }
      };
    }
  }
}