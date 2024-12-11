import { Histogram, Counter, Gauge } from 'prom-client';
import { logger } from '../../../utils/logger.js';

export class EnhancedPerformanceMetricsCollector {
  constructor(registry) {
    this.setupMetrics(registry);
    this.startEventLoopMonitoring();
  }

  private setupMetrics(registry) {
    this.responseTime = new Histogram({
      name: 'email_validation_duration_seconds',
      help: 'Email validation duration in seconds',
      labelNames: ['stage', 'status'],
      buckets: [0.1, 0.5, 1, 2, 5],
      registers: [registry]
    });

    this.memoryUsage = new Gauge({
      name: 'process_memory_usage_bytes',
      help: 'Process memory usage',
      labelNames: ['type'],
      registers: [registry]
    });

    this.eventLoopLag = new Histogram({
      name: 'event_loop_lag_seconds',
      help: 'Event loop lag in seconds',
      buckets: [0.001, 0.005, 0.015, 0.05, 0.1],
      registers: [registry]
    });

    this.validationErrors = new Counter({
      name: 'validation_errors_total',
      help: 'Total validation errors',
      labelNames: ['type', 'stage'],
      registers: [registry]
    });
  }

  recordResponseTime(duration, stage, status) {
    try {
      this.responseTime.observe({ stage, status }, duration / 1000);
    } catch (error) {
      logger.error('Error recording response time:', error);
    }
  }

  recordError(type, stage) {
    try {
      this.validationErrors.inc({ type, stage });
    } catch (error) {
      logger.error('Error recording validation error:', error);
    }
  }

  private startEventLoopMonitoring() {
    setInterval(() => {
      this.measureEventLoopLag();
      this.updateMemoryMetrics();
    }, 5000);
  }

  private async measureEventLoopLag() {
    const start = Date.now();
    return new Promise(resolve => {
      setImmediate(() => {
        const lag = Date.now() - start;
        try {
          this.eventLoopLag.observe(lag / 1000);
        } catch (error) {
          logger.error('Error recording event loop lag:', error);
        }
        resolve(lag);
      });
    });
  }

  private updateMemoryMetrics() {
    try {
      const memory = process.memoryUsage();
      this.memoryUsage.set({ type: 'heapUsed' }, memory.heapUsed);
      this.memoryUsage.set({ type: 'heapTotal' }, memory.heapTotal);
      this.memoryUsage.set({ type: 'rss' }, memory.rss);
      this.memoryUsage.set({ type: 'external' }, memory.external);
    } catch (error) {
      logger.error('Error updating memory metrics:', error);
    }
  }

  async getDetailedMetrics() {
    try {
      const eventLoopLag = await this.measureEventLoopLag();
      const memory = process.memoryUsage();
      const cpuUsage = process.cpuUsage();

      return {
        performance: {
          eventLoopLag,
          memory: {
            heapUsed: memory.heapUsed,
            heapTotal: memory.heapTotal,
            rss: memory.rss,
            external: memory.external
          },
          cpu: {
            user: cpuUsage.user,
            system: cpuUsage.system
          }
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error getting detailed metrics:', error);
      return null;
    }
  }
}