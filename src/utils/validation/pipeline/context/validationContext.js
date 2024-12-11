import { MetricsCollector } from '../../../../services/metrics/core/metricsCollector.js';

export class ValidationContext {
  constructor(email, options = {}) {
    this.email = email;
    this.options = options;
    this.metrics = new MetricsCollector();
    this.results = new Map();
    this.startTime = Date.now();
  }

  setResult(stageName, result) {
    this.results.set(stageName, {
      ...result,
      timestamp: new Date().toISOString()
    });
  }

  getResult(stageName) {
    return this.results.get(stageName);
  }

  getAllResults() {
    return Object.fromEntries(this.results);
  }

  getDuration() {
    return Date.now() - this.startTime;
  }

  getMetrics() {
    return this.metrics.getMetrics();
  }
}