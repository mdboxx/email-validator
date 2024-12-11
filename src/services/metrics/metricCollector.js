import { logger } from '../../utils/logger.js';

export class MetricCollector {
  constructor() {
    this.metrics = {
      validations: {
        total: 0,
        successful: 0,
        failed: 0
      },
      errors: {
        syntax: 0,
        domain: 0,
        mx: 0,
        smtp: 0
      },
      performance: {
        totalResponseTime: 0,
        averageResponseTime: 0
      }
    };
  }

  recordValidation(result, responseTime) {
    try {
      this.updateValidationMetrics(result);
      this.updatePerformanceMetrics(responseTime);
      this.updateErrorMetrics(result);
    } catch (error) {
      logger.error('Error recording metrics:', error);
    }
  }

  private updateValidationMetrics(result) {
    this.metrics.validations.total++;
    if (result.success) {
      this.metrics.validations.successful++;
    } else {
      this.metrics.validations.failed++;
    }
  }

  private updatePerformanceMetrics(responseTime) {
    this.metrics.performance.totalResponseTime += responseTime;
    this.metrics.performance.averageResponseTime = 
      this.metrics.performance.totalResponseTime / this.metrics.validations.total;
  }

  private updateErrorMetrics(result) {
    if (!result.success) {
      if (result.details?.syntax?.errors?.length) {
        this.metrics.errors.syntax++;
      }
      if (result.details?.domain?.errors?.length) {
        this.metrics.errors.domain++;
      }
      if (result.details?.mx?.valid === false) {
        this.metrics.errors.mx++;
      }
      if (result.details?.smtp?.valid === false) {
        this.metrics.errors.smtp++;
      }
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      successRate: this.calculateSuccessRate(),
      timestamp: new Date().toISOString()
    };
  }

  private calculateSuccessRate() {
    if (this.metrics.validations.total === 0) return 0;
    return (this.metrics.validations.successful / this.metrics.validations.total) * 100;
  }
}