import { Counter } from 'prom-client';
import { BaseMetricsCollector } from './BaseMetricsCollector.js';
import { logger } from '../../../utils/logger.js';

export class CacheMetricsCollector extends BaseMetricsCollector {
  constructor(registry) {
    super();
    this.hits = new Counter({
      name: 'cache_hits_total',
      help: 'Total number of cache hits',
      registers: [registry]
    });

    this.misses = new Counter({
      name: 'cache_misses_total',
      help: 'Total number of cache misses',
      registers: [registry]
    });
  }

  recordHit() {
    try {
      this.hits.inc();
    } catch (error) {
      logger.error('Error recording cache hit:', error);
    }
  }

  recordMiss() {
    try {
      this.misses.inc();
    } catch (error) {
      logger.error('Error recording cache miss:', error);
    }
  }
}