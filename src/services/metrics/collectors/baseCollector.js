import { logger } from '../../../utils/logger.js';

export class BaseCollector {
  constructor() {
    this.metrics = {};
    this.lastUpdated = null;
  }

  record(data) {
    try {
      this.updateMetrics(data);
      this.lastUpdated = new Date();
    } catch (error) {
      logger.error('Error recording metrics:', error);
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      lastUpdated: this.lastUpdated,
      timestamp: new Date().toISOString()
    };
  }

  protected updateMetrics(data) {
    // To be implemented by child classes
    throw new Error('updateMetrics must be implemented');
  }

  reset() {
    this.metrics = {};
    this.lastUpdated = null;
  }
}