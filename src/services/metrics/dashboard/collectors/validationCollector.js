import { BaseCollector } from './baseCollector.js';
import { logger } from '../../../../utils/logger.js';

export class ValidationCollector extends BaseCollector {
  constructor() {
    super();
    this.metrics = {
      total: 0,
      successful: 0,
      failed: 0,
      successRate: 0,
      validationTypes: {
        syntax: { passed: 0, failed: 0 },
        domain: { passed: 0, failed: 0 },
        dns: { passed: 0, failed: 0 },
        disposable: { passed: 0, failed: 0 }
      }
    };
  }

  protected updateMetrics(result) {
    try {
      this.updateTotals(result);
      this.updateValidationTypes(result);
      this.calculateSuccessRate();
    } catch (error) {
      logger.error('Error updating validation metrics:', error);
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
    Object.entries(result.details || {}).forEach(([type, details]) => {
      if (this.metrics.validationTypes[type]) {
        if (details.isValid) {
          this.metrics.validationTypes[type].passed++;
        } else {
          this.metrics.validationTypes[type].failed++;
        }
      }
    });
  }

  private calculateSuccessRate() {
    this.metrics.successRate = this.metrics.total > 0
      ? (this.metrics.successful / this.metrics.total) * 100
      : 0;
  }

  getValidationReport() {
    return {
      ...this.getMetrics(),
      summary: {
        successRate: `${this.metrics.successRate.toFixed(2)}%`,
        totalValidations: this.metrics.total,
        failureBreakdown: Object.entries(this.metrics.validationTypes)
          .reduce((acc, [type, stats]) => ({
            ...acc,
            [type]: `${stats.failed} (${((stats.failed / this.metrics.total) * 100).toFixed(1)}%)`
          }), {})
      }
    };
  }
}