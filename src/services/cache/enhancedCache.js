import { RedisCacheStrategy } from './strategies/redisCacheStrategy.js';
import { MemoryCacheStrategy } from './strategies/memoryCacheStrategy.js';
import { logger } from '../../utils/logger.js';

export class EnhancedCache {
  constructor(options = {}) {
    this.redisCache = new RedisCacheStrategy();
    this.memoryCache = new MemoryCacheStrategy(options);
    this.stats = {
      hits: { memory: 0, redis: 0 },
      misses: { memory: 0, redis: 0 },
      errors: 0,
      latency: {
        memory: { total: 0, count: 0 },
        redis: { total: 0, count: 0 }
      }
    };
  }

  async get(key) {
    try {
      const startTime = Date.now();
      
      // Try memory cache first
      let result = await this.memoryCache.get(key);
      const memoryDuration = Date.now() - startTime;
      this.updateLatencyStats('memory', memoryDuration);

      if (result) {
        this.stats.hits.memory++;
        return result;
      }
      this.stats.misses.memory++;

      // Try Redis cache
      const redisStartTime = Date.now();
      result = await this.redisCache.get(key);
      const redisDuration = Date.now() - redisStartTime;
      this.updateLatencyStats('redis', redisDuration);

      if (result) {
        this.stats.hits.redis++;
        // Update memory cache
        await this.memoryCache.set(key, result);
        return result;
      }
      this.stats.misses.redis++;

      return null;
    } catch (error) {
      logger.error('Cache retrieval error:', error);
      this.stats.errors++;
      return null;
    }
  }

  async set(key, value, ttl) {
    try {
      await Promise.all([
        this.redisCache.set(key, value, ttl),
        this.memoryCache.set(key, value, ttl)
      ]);
      return true;
    } catch (error) {
      logger.error('Cache storage error:', error);
      this.stats.errors++;
      return false;
    }
  }

  private updateLatencyStats(type, duration) {
    this.stats.latency[type].total += duration;
    this.stats.latency[type].count++;
  }

  async getStats() {
    const [redisStats, memoryStats] = await Promise.all([
      this.redisCache.getStats(),
      this.memoryCache.getStats()
    ]);

    const calculateAverageLatency = (type) => {
      const { total, count } = this.stats.latency[type];
      return count > 0 ? total / count : 0;
    };

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      errors: this.stats.errors,
      hitRate: {
        memory: this.calculateHitRate('memory'),
        redis: this.calculateHitRate('redis')
      },
      latency: {
        memory: calculateAverageLatency('memory'),
        redis: calculateAverageLatency('redis')
      },
      backend: {
        redis: redisStats,
        memory: memoryStats
      },
      timestamp: new Date().toISOString()
    };
  }

  private calculateHitRate(type) {
    const hits = this.stats.hits[type];
    const misses = this.stats.misses[type];
    const total = hits + misses;
    return total > 0 ? (hits / total) * 100 : 0;
  }

  async clear() {
    await Promise.all([
      this.redisCache.clear(),
      this.memoryCache.clear()
    ]);
    this.resetStats();
  }

  private resetStats() {
    this.stats = {
      hits: { memory: 0, redis: 0 },
      misses: { memory: 0, redis: 0 },
      errors: 0,
      latency: {
        memory: { total: 0, count: 0 },
        redis: { total: 0, count: 0 }
      }
    };
  }
}