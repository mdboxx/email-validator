import { ValidationMetricsCollector } from './validationMetricsCollector.js';
import { PerformanceMetricsCollector } from './performanceMetricsCollector.js';
import { logger } from '../../../utils/logger.js';

export class MetricsAggregator {
  constructor() {
    this.validationMetrics = new ValidationMetricsCollector();
    this.performanceMetrics = new PerformanceMetricsCollector();
  }

  recordValidation(result, duration) {
    try {
      this.validationMetrics.recordValidation(result, duration);
      this.performanceMetrics.recordResponseTime(duration);
    } catch (error) {
      logger.error('Error recording metrics:', error);
    }
  }

  async getAggregatedMetrics() {
    try {
      const [validation, performance] = await Promise.all([
        this.validationMetrics.getMetrics(),
        this.performanceMetrics.getDetailedMetrics()
      ]);

      return {
        validation,
        performance,
        timestamp: new Date().toISOString(),
        summary: {
          successRate: validation.successRate,
          averageResponseTime: performance.performance.averageTime,
          totalValidations: validation.total,
          errorRate: (validation.errors.count / validation.total) * 100
        }
      };
    } catch (error) {
      logger.error('Error aggregating metrics:', error);
      throw error;
    }
  }

  reset() {
    this.validationMetrics.reset();
    this.performanceMetrics = new PerformanceMetricsCollector();
  }
}