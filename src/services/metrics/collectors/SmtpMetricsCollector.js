import { Gauge, Histogram } from 'prom-client';
import { BaseMetricsCollector } from './BaseMetricsCollector.js';
import { logger } from '../../../utils/logger.js';

export class SmtpMetricsCollector extends BaseMetricsCollector {
  constructor(registry) {
    super();
    this.connectionGauge = new Gauge({
      name: 'smtp_connections_active',
      help: 'Number of active SMTP connections',
      registers: [registry]
    });

    this.latency = new Histogram({
      name: 'smtp_connection_latency_seconds',
      help: 'SMTP connection latency',
      buckets: [0.1, 0.5, 1, 2, 5],
      registers: [registry]
    });
  }

  recordConnection(active) {
    try {
      this.connectionGauge.set(active);
    } catch (error) {
      logger.error('Error recording SMTP connection metric:', error);
    }
  }

  recordLatency(duration) {
    try {
      this.latency.observe(duration / 1000);
    } catch (error) {
      logger.error('Error recording SMTP latency metric:', error);
    }
  }
}