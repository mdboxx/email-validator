import { logger } from '../../logger.js';

export class ValidationMetrics {
  constructor() {
    this.stageMetrics = new Map();
  }

  recordStage(stageName, duration, success) {
    try {
      const metrics = this.stageMetrics.get(stageName) || {
        totalTime: 0,
        count: 0,
        successful: 0,
        failed: 0
      };

      metrics.totalTime += duration;
      metrics.count++;
      if (success) {
        metrics.successful++;
      } else {
        metrics.failed++;
      }

      this.stageMetrics.set(stageName, metrics);
    } catch (error) {
      logger.error('Error recording validation stage metrics:', error);
    }
  }

  getStageMetrics(stageName) {
    const metrics = this.stageMetrics.get(stageName);
    if (!metrics) return null;

    return {
      ...metrics,
      averageTime: metrics.totalTime / metrics.count,
      successRate: (metrics.successful / metrics.count) * 100
    };
  }

  getAllMetrics() {
    const metrics = {};
    for (const [stage, data] of this.stageMetrics.entries()) {
      metrics[stage] = {
        ...data,
        averageTime: data.totalTime / data.count,
        successRate: (data.successful / data.count) * 100
      };
    }
    return metrics;
  }
}