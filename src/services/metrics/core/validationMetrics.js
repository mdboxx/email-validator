export class ValidationMetrics {
  constructor() {
    this.metrics = {
      total: 0,
      successful: 0,
      failed: 0,
      totalTime: 0,
      minTime: Infinity,
      maxTime: 0
    };
  }

  recordValidation(success, duration) {
    this.metrics.total++;
    this.metrics.totalTime += duration;
    this.metrics.minTime = Math.min(this.metrics.minTime, duration);
    this.metrics.maxTime = Math.max(this.metrics.maxTime, duration);

    if (success) {
      this.metrics.successful++;
    } else {
      this.metrics.failed++;
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      averageTime: this.metrics.totalTime / this.metrics.total,
      successRate: (this.metrics.successful / this.metrics.total) * 100,
      timestamp: new Date().toISOString()
    };
  }
}