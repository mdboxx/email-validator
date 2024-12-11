export class StageMetrics {
  constructor() {
    this.stages = new Map();
  }

  recordStage(stageName, duration, success) {
    const metrics = this.stages.get(stageName) || {
      total: 0,
      successful: 0,
      failed: 0,
      totalTime: 0,
      minTime: Infinity,
      maxTime: 0
    };

    metrics.total++;
    metrics.totalTime += duration;
    metrics.minTime = Math.min(metrics.minTime, duration);
    metrics.maxTime = Math.max(metrics.maxTime, duration);

    if (success) {
      metrics.successful++;
    } else {
      metrics.failed++;
    }

    this.stages.set(stageName, metrics);
  }

  getStageMetrics(stageName) {
    const metrics = this.stages.get(stageName);
    if (!metrics) return null;

    return {
      ...metrics,
      averageTime: metrics.totalTime / metrics.total,
      successRate: (metrics.successful / metrics.total) * 100
    };
  }

  getAllMetrics() {
    const metrics = {};
    for (const [stage, data] of this.stages.entries()) {
      metrics[stage] = {
        ...data,
        averageTime: data.totalTime / data.total,
        successRate: (data.successful / data.total) * 100
      };
    }
    return metrics;
  }
}