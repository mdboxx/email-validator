import { logger } from '../../../utils/logger.js';

export class PerformanceMetricsCollector {
  async collectMetrics() {
    try {
      return {
        memory: this.collectMemoryMetrics(),
        cpu: this.collectCpuMetrics(),
        eventLoop: await this.collectEventLoopMetrics(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error collecting performance metrics:', error);
      throw error;
    }
  }

  private collectMemoryMetrics() {
    const memory = process.memoryUsage();
    return {
      heapUsed: memory.heapUsed,
      heapTotal: memory.heapTotal,
      external: memory.external,
      rss: memory.rss
    };
  }

  private collectCpuMetrics() {
    return {
      usage: process.cpuUsage(),
      uptime: process.uptime()
    };
  }

  private async collectEventLoopMetrics() {
    const lag = await this.measureEventLoopLag();
    return {
      lag,
      utilization: process.eventLoopUtilization()
    };
  }

  private async measureEventLoopLag() {
    const start = Date.now();
    return new Promise(resolve => {
      setImmediate(() => {
        resolve(Date.now() - start);
      });
    });
  }
}