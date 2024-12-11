import { logger } from '../../../utils/logger.js';

export class EnhancedValidationMetricsCollector {
  constructor() {
    this.metrics = {
      total: 0,
      successful: 0,
      failed: 0,
      stages: new Map(),
      validationTypes: {
        syntax: { passed: 0, failed: 0 },
        domain: { passed: 0, failed: 0 },
        mx: { passed: 0, failed: 0 },
        smtp: { passed: 0, failed: 0 },
        disposable: { passed: 0, failed: 0 },
        role: { passed: 0, failed: 0 },
        typo: { passed: 0, failed: 0 }
      },
      performance: {
        totalDuration: 0,
        averageDuration: 0,
        minDuration: Infinity,
        maxDuration: 0,
        durations: []
      },
      cache: {
        hits: 0,
        misses: 0,
        ratio: 0
      },
      errors: {
        count: 0,
        types: new Map(),
        recent: []
      }
    };
  }

  recordValidation(result, duration) {
    try {
      // Update basic counts
      this.metrics.total++;
      this.updateValidationCounts(result);

      // Update performance metrics
      this.updatePerformanceMetrics(duration);

      // Update validation types
      this.updateValidationTypes(result);

      // Update error tracking if applicable
      if (!result.isValid) {
        this.updateErrorMetrics(result);
      }

      // Calculate success rate
      this.calculateSuccessRate();
    } catch (error) {
      logger.error('Error recording validation metrics:', error);
    }
  }

  private updateValidationCounts(result) {
    if (result.isValid) {
      this.metrics.successful++;
    } else {
      this.metrics.failed++;
    }
  }

  private updatePerformanceMetrics(duration) {
    this.metrics.performance.totalDuration += duration;
    this.metrics.performance.averageDuration = 
      this.metrics.performance.totalDuration / this.metrics.total;
    this.metrics.performance.minDuration = 
      Math.min(this.metrics.performance.minDuration, duration);
    this.metrics.performance.maxDuration = 
      Math.max(this.metrics.performance.maxDuration, duration);
    
    // Keep last 1000 durations for percentile calculations
    this.metrics.performance.durations.push(duration);
    if (this.metrics.performance.durations.length > 1000) {
      this.metrics.performance.durations.shift();
    }
  }

  private updateValidationTypes(result) {
    for (const [type, details] of Object.entries(result.validations || {})) {
      if (this.metrics.validationTypes[type]) {
        if (details.isValid) {
          this.metrics.validationTypes[type].passed++;
        } else {
          this.metrics.validationTypes[type].failed++;
        }
      }
    }
  }

  private updateErrorMetrics(result) {
    this.metrics.errors.count++;
    
    // Track error types
    for (const error of result.errors) {
      const count = this.metrics.errors.types.get(error) || 0;
      this.metrics.errors.types.set(error, count + 1);
    }

    // Keep track of recent errors
    this.metrics.errors.recent.unshift({
      timestamp: new Date().toISOString(),
      errors: result.errors,
      email: result.email
    });

    // Keep only last 100 errors
    if (this.metrics.errors.recent.length > 100) {
      this.metrics.errors.recent.pop();
    }
  }

  private calculateSuccessRate() {
    this.metrics.successRate = this.metrics.total > 0 ?
      (this.metrics.successful / this.metrics.total) * 100 : 0;
  }

  getMetrics() {
    return {
      ...this.metrics,
      performance: {
        ...this.metrics.performance,
        percentiles: this.calculatePercentiles(),
        histogram: this.generateHistogram()
      },
      errors: {
        ...this.metrics.errors,
        types: Object.fromEntries(this.metrics.errors.types)
      },
      timestamp: new Date().toISOString()
    };
  }

  private calculatePercentiles() {
    const sorted = [...this.metrics.performance.durations].sort((a, b) => a - b);
    return {
      p50: this.getPercentile(sorted, 50),
      p75: this.getPercentile(sorted, 75),
      p90: this.getPercentile(sorted, 90),
      p95: this.getPercentile(sorted, 95),
      p99: this.getPercentile(sorted, 99)
    };
  }

  private getPercentile(sorted, percentile) {
    if (sorted.length === 0) return 0;
    const index = Math.ceil((percentile / 100) * sorted.length) - 1;
    return sorted[index];
  }

  private generateHistogram() {
    const buckets = new Map();
    const bucketSize = 100; // 100ms buckets

    for (const duration of this.metrics.performance.durations) {
      const bucket = Math.floor(duration / bucketSize) * bucketSize;
      const count = buckets.get(bucket) || 0;
      buckets.set(bucket, count + 1);
    }

    return Array.from(buckets.entries())
      .map(([bucket, count]) => ({
        range: `${bucket}-${bucket + bucketSize}ms`,
        count
      }))
      .sort((a, b) => parseInt(a.range) - parseInt(b.range));
  }

  reset() {
    this.metrics = {
      total: 0,
      successful: 0,
      failed: 0,
      stages: new Map(),
      validationTypes: {
        syntax: { passed: 0, failed: 0 },
        domain: { passed: 0, failed: 0 },
        mx: { passed: 0, failed: 0 },
        smtp: { passed: 0, failed: 0 },
        disposable: { passed: 0, failed: 0 },
        role: { passed: 0, failed: 0 },
        typo: { passed: 0, failed: 0 }
      },
      performance: {
        totalDuration: 0,
        averageDuration: 0,
        minDuration: Infinity,
        maxDuration: 0,
        durations: []
      },
      cache: {
        hits: 0,
        misses: 0,
        ratio: 0
      },
      errors: {
        count: 0,
        types: new Map(),
        recent: []
      }
    };
  }
}