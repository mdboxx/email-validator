import { logger } from '../../utils/logger.js';

export class ValidationMetrics {
  constructor() {
    this.metrics = {
      totalValidations: 0,
      successfulValidations: 0,
      failedValidations: 0,
      syntaxErrors: 0,
      domainErrors: 0,
      mxErrors: 0,
      smtpErrors: 0,
      averageResponseTime: 0,
      totalResponseTime: 0
    };
  }

  /**
   * Record validation attempt
   * @param {Object} result Validation result
   * @param {number} responseTime Response time in milliseconds
   */
  recordValidation(result, responseTime) {
    try {
      this.metrics.totalValidations++;
      this.metrics.totalResponseTime += responseTime;
      this.metrics.averageResponseTime = 
        this.metrics.totalResponseTime / this.metrics.totalValidations;

      if (result.success) {
        this.metrics.successfulValidations++;
      } else {
        this.metrics.failedValidations++;
        this.categorizeErrors(result);
      }
    } catch (error) {
      logger.error('Error recording validation metrics:', error);
    }
  }

  /**
   * Categorize validation errors
   * @private
   * @param {Object} result Validation result
   */
  categorizeErrors(result) {
    if (result.details?.syntax?.errors?.length > 0) {
      this.metrics.syntaxErrors++;
    }
    if (result.details?.domain?.errors?.length > 0) {
      this.metrics.domainErrors++;
    }
    if (result.details?.mx?.valid === false) {
      this.metrics.mxErrors++;
    }
    if (result.details?.smtp?.valid === false) {
      this.metrics.smtpErrors++;
    }
  }

  /**
   * Get current metrics
   * @returns {Object} Current metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      successRate: this.calculateSuccessRate(),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Calculate success rate
   * @private
   * @returns {number} Success rate percentage
   */
  calculateSuccessRate() {
    if (this.metrics.totalValidations === 0) return 0;
    return (this.metrics.successfulValidations / this.metrics.totalValidations) * 100;
  }
}