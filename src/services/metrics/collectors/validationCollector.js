import { logger } from '../../../utils/logger.js';

export class ValidationCollector {
  constructor() {
    this.metrics = {
      total: 0,
      successful: 0,
      failed: 0,
      successRate: 0,
      validationTypes: {
        syntax: { passed: 0, failed: 0 },
        domain: { passed: 0, failed: 0 },
        mx: { passed: 0, failed: 0 },
        smtp: { passed: 0, failed: 0 }
      }
    };
  }

  record(result) {
    try {
      this.updateTotals(result);
      this.updateValidationTypes(result);
      this.calculateSuccessRate();
    } catch (error) {
      logger.error('Error recording validation metrics:', error);
    }
  }

  private updateTotals(result) {
    this.metrics.total++;
    if (result.success) {
      this.metrics.successful++;
    } else {
      this.metrics.failed++;
    }
  }

  private updateValidationTypes(result) {
    const types = ['syntax', 'domain', 'mx', 'smtp'];
    types.forEach(type => {
      if (result.details?.[type]?.isValid) {
        this.metrics.validationTypes[type].passed++;
      } else {
        this.metrics.validationTypes[type].failed++;
      }
    });
  }

  private calculateSuccessRate() {
    this.metrics.successRate = this.metrics.total > 0
      ? (this.metrics.successful / this.metrics.total) * 100
      : 0;
  }

  getMetrics() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString()
    };
  }
}