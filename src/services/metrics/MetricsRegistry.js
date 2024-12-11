import { Registry } from 'prom-client';
import { ValidationMetricsCollector } from './collectors/ValidationMetricsCollector.js';
import { SmtpMetricsCollector } from './collectors/SmtpMetricsCollector.js';
import { CacheMetricsCollector } from './collectors/CacheMetricsCollector.js';
import { logger } from '../../utils/logger.js';

export class MetricsRegistry {
  constructor() {
    this.registry = new Registry();
    this.collectors = {
      validation: new ValidationMetricsCollector(this.registry),
      smtp: new SmtpMetricsCollector(this.registry),
      cache: new CacheMetricsCollector(this.registry)
    };
  }

  getCollector(type) {
    const collector = this.collectors[type];
    if (!collector) {
      throw new Error(`Unknown collector type: ${type}`);
    }
    return collector;
  }

  async getMetrics() {
    try {
      return await this.registry.metrics();
    } catch (error) {
      logger.error('Error collecting metrics:', error);
      throw error;
    }
  }
}