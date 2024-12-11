import { MetricsExporter } from '../../metrics/prometheus/metricsExporter.js';

export class ValidationContext {
  constructor(email, options = {}) {
    this.email = email;
    this.options = options;
    this.startTime = Date.now();
    this.results = new Map();
    this.metrics = new MetricsExporter();
  }

  addResult(stage, result) {
    this.results.set(stage, {
      ...result,
      duration: this.getDuration(),
      timestamp: new Date().toISOString()
    });
  }

  getDuration() {
    return Date.now() - this.startTime;
  }

  getResults() {
    return Array.from(this.results.entries()).map(([stage, result]) => ({
      stage,
      ...result
    }));
  }
}