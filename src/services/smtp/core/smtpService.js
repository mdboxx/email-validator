import { SmtpVerifier } from '../smtpVerifier.js';
import { ValidationResult } from '../../../utils/validation/validationResult.js';
import { logger } from '../../../utils/logger.js';

export class SmtpService {
  constructor() {
    this.verifier = new SmtpVerifier();
    this.fallbackPorts = [25, 587, 465];
  }

  async verify(email) {
    try {
      const result = await this.verifier.verify(email);
      
      // If verification fails, try fallback ports
      if (!result.isValid) {
        const fallbackResult = await this.tryFallbackPorts(email);
        if (fallbackResult.isValid) {
          return fallbackResult;
        }
      }

      return result;
    } catch (error) {
      logger.error('SMTP verification error:', error);
      return ValidationResult.failure('SMTP verification failed', {
        error: error.message
      });
    }
  }

  private async tryFallbackPorts(email) {
    const [, domain] = email.split('@');
    
    for (const port of this.fallbackPorts) {
      try {
        const result = await this.verifier.testConnection({
          host: domain,
          port,
          secure: port === 465,
          timeout: 5000
        });

        if (result.success) {
          return await this.verifier.verify(email);
        }
      } catch (error) {
        logger.debug(`Fallback attempt on port ${port} failed:`, error);
        continue;
      }
    }

    return ValidationResult.failure('All SMTP attempts failed');
  }

  async testServer(config) {
    return this.verifier.testConnection(config);
  }
}