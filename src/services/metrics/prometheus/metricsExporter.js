import { Registry, Counter, Histogram, Gauge } from 'prom-client';
import { logger } from '../../../utils/logger.js';

export class MetricsExporter {
  constructor() {
    this.registry = new Registry();
    this.setupMetrics();
  }

  private setupMetrics() {
    // Validation metrics
    this.validationCounter = new Counter({
      name: 'email_validations_total',
      help: 'Total number of email validations',
      labelNames: ['status', 'validation_type']
    });

    this.validationDuration = new Histogram({
      name: 'email_validation_duration_seconds',
      help: 'Email validation duration in seconds',
      labelNames: ['validation_type'],
      buckets: [0.1, 0.5, 1, 2, 5]
    });

    // SMTP metrics
    this.smtpConnectionGauge = new Gauge({
      name: 'smtp_connections_active',
      help: 'Number of active SMTP connections'
    });

    this.smtpLatency = new Histogram({
      name: 'smtp_connection_latency_seconds',
      help: 'SMTP connection latency',
      buckets: [0.1, 0.5, 1, 2, 5]
    });

    // Cache metrics
    this.cacheHitCounter = new Counter({
      name: 'cache_hits_total',
      help: 'Total number of cache hits'
    });

    this.cacheMissCounter = new Counter({
      name: 'cache_misses_total',
      help: 'Total number of cache misses'
    });

    // Rate limiting metrics
    this.rateLimitCounter = new Counter({
      name: 'rate_limit_exceeded_total',
      help: 'Total number of rate limit exceeded events'
    });

    // Register all metrics
    this.registry.registerMetric(this.validationCounter);
    this.registry.registerMetric(this.validationDuration);
    this.registry.registerMetric(this.smtpConnectionGauge);
    this.registry.registerMetric(this.smtpLatency);
    this.registry.registerMetric(this.cacheHitCounter);
    this.registry.registerMetric(this.cacheMissCounter);
    this.registry.registerMetric(this.rateLimitCounter);
  }

  recordValidation(result, duration, type) {
    try {
      this.validationCounter.inc({
        status: result.isValid ? 'success' : 'failure',
        validation_type: type
      });
      this.validationDuration.observe({ validation_type: type }, duration / 1000);
    } catch (error) {
      logger.error('Error recording validation metrics:', error);
    }
  }

  recordSmtpConnection(active) {
    this.smtpConnectionGauge.set(active);
  }

  recordSmtpLatency(duration) {
    this.smtpLatency.observe(duration / 1000);
  }

  recordCacheHit() {
    this.cacheHitCounter.inc();
  }

  recordCacheMiss() {
    this.cacheMissCounter.inc();
  }

  recordRateLimit() {
    this.rateLimitCounter.inc();
  }

  async getMetrics() {
    try {
      return await this.registry.metrics();
    } catch (error) {
      logger.error('Error collecting metrics:', error);
      throw error;
    }
  }
}