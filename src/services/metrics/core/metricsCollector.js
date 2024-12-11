import { logger } from '../../../utils/logger.js';

export class MetricsCollector {
  constructor() {
    this.metrics = {
      validations: {
        total: 0,
        successful: 0,
        failed: 0
      },
      timing: {
        totalTime: 0,
        averageTime: 0
      },
      stages: new Map()
    };
  }

  recordValidation(result, duration) {
    try {
      this.metrics.validations.total++;
      if (result.isValid) {
        this.metrics.validations.successful++;
      } else {
        this.metrics.validations.failed++;
      }

      this.metrics.timing.totalTime += duration;
      this.metrics.timing.averageTime = 
        this.metrics.timing.totalTime / this.metrics.validations.total;
    } catch (error) {
      logger.error('Error recording metrics:', error);
    }
  }

  recordStage(stageName, duration, success) {
    const stage = this.metrics.stages.get(stageName) || {
      total: 0,
      successful: 0,
      failed: 0,
      totalTime: 0
    };

    stage.total++;
    if (success) {
      stage.successful++;
    } else {
      stage.failed++;
    }
    stage.totalTime += duration;

    this.metrics.stages.set(stageName, stage);
  }

  getMetrics() {
    return {
      ...this.metrics,
      stages: Object.fromEntries(this.metrics.stages),
      timestamp: new Date().toISOString()
    };
  }
}