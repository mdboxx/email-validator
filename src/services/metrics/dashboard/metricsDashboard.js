import { ValidationCollector } from './collectors/validationCollector.js';
import { PerformanceMetricsCollector } from '../../metrics/collectors/performanceMetricsCollector.js';
import { ErrorCollector } from '../../metrics/collectors/errorCollector.js';
import { ConsoleMetricsReporter } from '../../metrics/reporters/consoleReporter.js';
import { JsonMetricsReporter } from '../../metrics/reporters/jsonReporter.js';
import { logger } from '../../../utils/logger.js';

export class MetricsDashboard {
  constructor() {
    this.collectors = {
      validation: new ValidationCollector(),
      performance: new PerformanceMetricsCollector(),
      errors: new ErrorCollector()
    };
    
    this.reporters = {
      console: new ConsoleMetricsReporter(),
      json: new JsonMetricsReporter()
    };
  }

  recordValidation(result, duration) {
    try {
      this.collectors.validation.record(result);
      this.collectors.performance.record(duration);
      
      if (!result.success) {
        this.collectors.errors.record(result.errors);
      }
    } catch (error) {
      logger.error('Error recording metrics:', error);
    }
  }

  async generateReport(format = 'console') {
    try {
      const metrics = {
        validation: this.collectors.validation.getValidationReport(),
        performance: this.collectors.performance.getPerformanceReport(),
        errors: this.collectors.errors.getMetrics(),
        timestamp: new Date().toISOString()
      };

      if (format === 'json') {
        return await this.reporters.json.report(metrics);
      }

      return this.reporters.console.report(metrics);
    } catch (error) {
      logger.error('Error generating metrics report:', error);
      throw error;
    }
  }

  getRealtimeMetrics() {
    return {
      validation: this.collectors.validation.getMetrics(),
      performance: this.collectors.performance.getMetrics(),
      errors: this.collectors.errors.getMetrics(),
      timestamp: new Date().toISOString()
    };
  }

  reset() {
    Object.values(this.collectors).forEach(collector => collector.reset());
  }
}