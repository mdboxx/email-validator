import { SmtpConnection } from '../../smtp/connection/smtpConnection.js';
import { ValidationResult } from '../../../utils/validation/validationResult.js';
import { logger } from '../../../utils/logger.js';

export class CatchAllDetector {
  constructor() {
    this.testEmailPrefix = `test-${Date.now()}`;
    this.connectionTimeout = 5000;
  }

  async detect(domain) {
    try {
      const mxRecords = await this.resolveMxRecords(domain);
      if (!mxRecords || mxRecords.length === 0) {
        return ValidationResult.failure('No MX records found');
      }

      const testEmail = `${this.testEmailPrefix}@${domain}`;
      const isCatchAll = await this.testCatchAll(mxRecords[0].exchange, testEmail);

      return ValidationResult.success({
        isCatchAll,
        mxServer: mxRecords[0].exchange,
        details: {
          tested: testEmail,
          timestamp: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Catch-all detection error:', error);
      return ValidationResult.failure('Catch-all detection failed');
    }
  }

  private async testCatchAll(mxServer, testEmail) {
    const connection = new SmtpConnection({
      host: mxServer,
      port: 25,
      timeout: this.connectionTimeout
    });

    try {
      await connection.connect();
      
      // SMTP conversation
      await connection.sendCommand('HELO email-validator.local');
      await connection.sendCommand('MAIL FROM:<validator@email-validator.local>');
      const response = await connection.sendCommand(`RCPT TO:<${testEmail}>`);
      
      // Check if server accepts non-existent email
      return response.startsWith('250');
    } catch (error) {
      logger.error('SMTP catch-all test error:', error);
      return false;
    } finally {
      connection.disconnect();
    }
  }

  private async resolveMxRecords(domain) {
    try {
      const { promisify } = await import('util');
      const { resolveMx } = await import('dns');
      const resolveMxAsync = promisify(resolveMx);
      return await resolveMxAsync(domain);
    } catch (error) {
      logger.error('MX resolution error:', error);
      return [];
    }
  }
}