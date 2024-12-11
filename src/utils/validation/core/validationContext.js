import { MetricsCollector } from '../../../services/metrics/core/metricsCollector.js';

export class ValidationContext {
  constructor(email, options = {}) {
    this.email = email;
    this.options = options;
    this.metrics = new MetricsCollector();
    this.results = new Map();
    this.startTime = Date.now();
  }

  addResult(stage, result) {
    this.results.set(stage, {
      ...result,
      duration: this.getDuration(),
      timestamp: new Date().toISOString()
    });
  }

  getResult(stage) {
    return this.results.get(stage);
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