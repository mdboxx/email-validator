import { SmtpConnectionManager } from '../connection/connectionManager.js';
import { ValidationResult } from '../../../utils/validation/validationResult.js';
import { logger } from '../../../utils/logger.js';

export class SmtpValidationStrategy {
  constructor(serverPool) {
    this.serverPool = serverPool;
  }

  async validate(email) {
    try {
      const server = await this.serverPool.getNextAvailableServer();
      if (!server) {
        return ValidationResult.failure('No SMTP servers available');
      }

      const transport = SmtpConnectionManager.createConnection(server);
      const result = await SmtpConnectionManager.verifyRecipient(transport, email);

      await this.handleValidationResult(server, result);
      return this.formatResult(result);
    } catch (error) {
      logger.error('SMTP validation error:', error);
      return ValidationResult.failure('SMTP validation failed');
    }
  }

  private async handleValidationResult(server, result) {
    if (!result.isValid) {
      await this.serverPool.monitor.checkServerHealth(server);
    }
  }

  private formatResult(result) {
    return result.isValid
      ? ValidationResult.success(result.details)
      : ValidationResult.failure('SMTP verification failed', result.details);
  }
}