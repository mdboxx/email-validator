import { logger } from '../../../utils/logger.js';

export class PerformanceCollector {
  constructor() {
    this.metrics = {
      totalResponseTime: 0,
      averageResponseTime: 0,
      minResponseTime: Infinity,
      maxResponseTime: 0,
      requestCount: 0
    };
  }

  record(responseTime) {
    try {
      this.metrics.totalResponseTime += responseTime;
      this.metrics.requestCount++;
      this.metrics.averageResponseTime = this.metrics.totalResponseTime / this.metrics.requestCount;
      this.metrics.minResponseTime = Math.min(this.metrics.minResponseTime, responseTime);
      this.metrics.maxResponseTime = Math.max(this.metrics.maxResponseTime, responseTime);
    } catch (error) {
      logger.error('Error recording performance metrics:', error);
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString()
    };
  }
}