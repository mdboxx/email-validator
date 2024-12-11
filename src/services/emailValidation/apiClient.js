import axios from 'axios';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { logger } from '../../utils/logger.js';

const rateLimiter = new RateLimiterMemory({
  points: 10, // Number of requests
  duration: 1, // Per second
});

export class EmailValidationAPI {
  constructor(apiKey, baseURL) {
    this.apiKey = apiKey;
    this.client = axios.create({
      baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Validates email using external API
   * @param {string} email - Email to validate
   * @returns {Promise<object>} Validation result
   */
  async validateEmail(email) {
    try {
      await rateLimiter.consume(email);
      
      const response = await this.client.post('/validate', { email });
      return {
        isValid: response.data.isValid,
        details: response.data,
        errors: []
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error('API validation error:', error);
        return {
          isValid: false,
          details: {},
          errors: [error.message]
        };
      }
      return {
        isValid: false,
        details: {},
        errors: ['Rate limit exceeded']
      };
    }
  }
}