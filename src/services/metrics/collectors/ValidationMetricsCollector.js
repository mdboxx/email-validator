import { Counter, Histogram } from 'prom-client';
import { BaseMetricsCollector } from './BaseMetricsCollector.js';
import { logger } from '../../../utils/logger.js';

export class ValidationMetricsCollector extends BaseMetricsCollector {
  constructor(registry) {
    super();
    this.counter = new Counter({
      name: 'email_validations_total',
      help: 'Total number of email validations',
      labelNames: ['status', 'validation_type'],
      registers: [registry]
    });

    this.duration = new Histogram({
      name: 'email_validation_duration_seconds',
      help: 'Email validation duration in seconds',
      labelNames: ['validation_type'],
      buckets: [0.1, 0.5, 1, 2, 5],
      registers: [registry]
    });
  }

  recordValidation(result, duration, type) {
    try {
      this.counter.inc({
        status: result.isValid ? 'success' : 'failure',
        validation_type: type
      });
      this.duration.observe({ validation_type: type }, duration / 1000);
    } catch (error) {
      logger.error('Error recording validation metrics:', error);
    }
  }
}