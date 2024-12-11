import { logger } from '../../../../utils/logger.js';

export class BaseCollector {
  constructor() {
    this.metrics = {};
    this.lastUpdate = new Date();
  }

  record(data) {
    try {
      this.updateMetrics(data);
      this.lastUpdate = new Date();
    } catch (error) {
      logger.error('Error recording metrics:', error);
    }
  }

  protected updateMetrics(data) {
    throw new Error('updateMetrics must be implemented by subclass');
  }

  getMetrics() {
    return {
      ...this.metrics,
      lastUpdate: this.lastUpdate,
      timestamp: new Date().toISOString()
    };
  }

  reset() {
    this.metrics = {};
    this.lastUpdate = new Date();
  }
}