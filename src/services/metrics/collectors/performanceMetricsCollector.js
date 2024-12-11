import { BaseCollector } from './baseCollector.js';
import { logger } from '../../../utils/logger.js';

export class PerformanceMetricsCollector extends BaseCollector {
  constructor() {
    super();
    this.metrics = {
      totalResponseTime: 0,
      averageResponseTime: 0,
      minResponseTime: Infinity,
      maxResponseTime: 0,
      requestCount: 0
    };
  }

  protected updateMetrics(responseTime) {
    try {
      this.metrics.totalResponseTime += responseTime;
      this.metrics.requestCount++;
      this.metrics.averageResponseTime = this.metrics.totalResponseTime / this.metrics.requestCount;
      this.metrics.minResponseTime = Math.min(this.metrics.minResponseTime, responseTime);
      this.metrics.maxResponseTime = Math.max(this.metrics.maxResponseTime, responseTime);
    } catch (error) {
      logger.error('Error updating performance metrics:', error);
    }
  }

  getPerformanceReport() {
    return {
      ...this.getMetrics(),
      summary: {
        averageLatency: `${this.metrics.averageResponseTime.toFixed(2)}ms`,
        totalRequests: this.metrics.requestCount,
        latencyRange: `${this.metrics.minResponseTime}ms - ${this.metrics.maxResponseTime}ms`
      }
    };
  }
}