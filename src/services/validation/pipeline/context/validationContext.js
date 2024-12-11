import { MetricsCollector } from '../../../metrics/core/metricsCollector.js';

export class ValidationContext {
  constructor(email, options = {}) {
    this.email = email;
    this.options = options;
    this.metrics = new MetricsCollector();
    this.results = new Map();
    this.startTime = Date.now();
    this.cache = options.cache;
  }

  async getCachedResult() {
    if (!this.cache || this.options.skipCache) {
      return null;
    }
    return this.cache.get(this.email);
  }

  async setCachedResult(result) {
    if (this.cache && !this.options.skipCache && result.isValid) {
      await this.cache.set(this.email, result);
    }
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