import { SmtpConnection } from './connection/smtpConnection.js';
import { ValidationResult } from '../../utils/validation/validationResult.js';
import { logger } from '../../utils/logger.js';

export class SmtpVerifier {
  constructor() {
    this.timeout = 10000; // 10 second timeout
    this.retryAttempts = 2;
    this.retryDelay = 1000;
  }

  async verify(email) {
    let lastError = null;
    
    for (let attempt = 0; attempt <= this.retryAttempts; attempt++) {
      try {
        if (attempt > 0) {
          await new Promise(resolve => setTimeout(resolve, this.retryDelay));
          logger.info(`Retry attempt ${attempt} for ${email}`);
        }

        const result = await this.attemptVerification(email);
        if (result.isValid) {
          logger.info(`SMTP verification successful for ${email}`);
          return ValidationResult.success(result.details);
        }
        
        lastError = result.details.error;
      } catch (error) {
        lastError = error.message;
        logger.error(`SMTP verification attempt ${attempt + 1} failed:`, error);
      }
    }

    return ValidationResult.failure('SMTP verification failed', {
      error: lastError,
      attempts: this.retryAttempts + 1
    });
  }

  private async attemptVerification(email) {
    const [, domain] = email.split('@');
    const mxRecords = await this.resolveMxRecords(domain);

    if (!mxRecords || mxRecords.length === 0) {
      return {
        isValid: false,
        details: { error: 'No MX records found' }
      };
    }

    // Try each MX server in order of priority
    for (const record of mxRecords) {
      try {
        const connection = new SmtpConnection({
          host: record.exchange,
          port: 25, // Standard SMTP port
          secure: false,
          timeout: this.timeout
        });

        const result = await connection.verifyEmail(email);
        connection.disconnect();

        if (result.isValid) {
          return result;
        }
      } catch (error) {
        logger.error(`Error with MX server ${record.exchange}:`, error);
        continue; // Try next MX server
      }
    }

    return {
      isValid: false,
      details: { error: 'All MX servers failed' }
    };
  }

  private async resolveMxRecords(domain) {
    try {
      const { promisify } = await import('util');
      const { resolveMx } = await import('dns');
      const resolveMxAsync = promisify(resolveMx);
      const records = await resolveMxAsync(domain);
      return records.sort((a, b) => a.priority - b.priority);
    } catch (error) {
      logger.error('MX resolution error:', error);
      return [];
    }
  }

  async testConnection(server) {
    try {
      logger.info('Testing SMTP connection:', {
        host: server.host,
        port: server.port,
        secure: server.secure
      });

      const connection = new SmtpConnection({
        ...server,
        timeout: this.timeout
      });

      const result = await connection.testConnection();
      
      if (!result.success) {
        logger.error('SMTP connection test failed:', result.error);
      } else {
        logger.info('SMTP connection test successful');
      }

      return result;
    } catch (error) {
      logger.error('SMTP connection test error:', error);
      return {
        success: false,
        error: error.message || 'Connection test failed',
        timestamp: new Date().toISOString()
      };
    }
  }
}