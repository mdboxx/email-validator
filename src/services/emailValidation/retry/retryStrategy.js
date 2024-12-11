import retry from 'async-retry';
import { logger } from '../../../utils/logger.js';

export class RetryStrategy {
  static async execute(operation, options = {}) {
    const defaultOptions = {
      retries: 3,
      factor: 2,
      minTimeout: 1000,
      maxTimeout: 5000,
      randomize: true,
      onRetry: (error, attempt) => {
        logger.warn(`Retry attempt ${attempt} due to error:`, error);
      }
    };

    try {
      return await retry(async (bail, attempt) => {
        try {
          return await operation();
        } catch (error) {
          if (!this.isRetryableError(error)) {
            bail(error);
            return;
          }
          throw error;
        }
      }, { ...defaultOptions, ...options });
    } catch (error) {
      logger.error('Operation failed after retries:', error);
      throw error;
    }
  }

  private static isRetryableError(error) {
    const retryableCodes = [
      'ETIMEDOUT',
      'ECONNREFUSED',
      'ECONNRESET',
      'ENOTFOUND'
    ];

    return (
      retryableCodes.includes(error.code) ||
      error.message.includes('timeout') ||
      error.message.includes('rate limit')
    );
  }
}