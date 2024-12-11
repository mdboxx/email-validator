import NodeCache from 'node-cache';
import { logger } from '../../../utils/logger.js';
import { config } from '../../../config/index.js';

export class ValidationCache {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: config.cache.ttl,
      maxKeys: config.cache.maxSize,
      checkperiod: 600
    });

    this.setupPeriodicCleanup();
  }

  get(key) {
    try {
      return this.cache.get(key);
    } catch (error) {
      logger.error('Cache retrieval error:', error);
      return null;
    }
  }

  set(key, value) {
    try {
      return this.cache.set(key, value);
    } catch (error) {
      logger.error('Cache storage error:', error);
      return false;
    }
  }

  delete(key) {
    try {
      return this.cache.del(key);
    } catch (error) {
      logger.error('Cache deletion error:', error);
      return false;
    }
  }

  flush() {
    try {
      return this.cache.flushAll();
    } catch (error) {
      logger.error('Cache flush error:', error);
      return false;
    }
  }

  getStats() {
    return {
      keys: this.cache.keys().length,
      hits: this.cache.getStats().hits,
      misses: this.cache.getStats().misses,
      hitRate: this.calculateHitRate(),
      timestamp: new Date().toISOString()
    };
  }

  private calculateHitRate() {
    const stats = this.cache.getStats();
    const total = stats.hits + stats.misses;
    return total > 0 ? (stats.hits / total) * 100 : 0;
  }

  private setupPeriodicCleanup() {
    setInterval(() => {
      try {
        const stats = this.getStats();
        logger.debug('Cache cleanup performed', stats);
      } catch (error) {
        logger.error('Cache cleanup error:', error);
      }
    }, 3600000); // Every hour
  }
}