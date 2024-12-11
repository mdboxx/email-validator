import { MetricsAggregator } from '../metrics/enhanced/metricsAggregator.js';
import { SmtpVerifier } from '../smtp/smtpVerifier.js';
import { RedisCache } from '../cache/redisCache.js';
import { logger } from '../../utils/logger.js';

export class HealthCheck {
  constructor() {
    this.metricsAggregator = new MetricsAggregator();
    this.smtpVerifier = new SmtpVerifier();
    this.cache = new RedisCache();
  }

  async check() {
    try {
      const [metrics, smtpStatus, cacheStatus] = await Promise.all([
        this.checkMetrics(),
        this.checkSmtp(),
        this.checkCache()
      ]);

      const status = this.determineOverallStatus(metrics, smtpStatus, cacheStatus);

      return {
        status,
        components: {
          metrics,
          smtp: smtpStatus,
          cache: cacheStatus
        },
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Health check failed:', error);
      throw error;
    }
  }

  private async checkMetrics() {
    try {
      const metrics = await this.metricsAggregator.getAggregatedMetrics();
      return {
        status: 'healthy',
        metrics
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  private async checkSmtp() {
    try {
      const servers = this.smtpVerifier.getAllServerStatuses();
      const healthyServers = servers.filter(s => s.health.isHealthy);
      
      return {
        status: healthyServers.length > 0 ? 'healthy' : 'degraded',
        servers: {
          total: servers.length,
          healthy: healthyServers.length
        }
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  private async checkCache() {
    try {
      const stats = await this.cache.getStats();
      return {
        status: stats.connected ? 'healthy' : 'unhealthy',
        stats
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message
      };
    }
  }

  private determineOverallStatus(metrics, smtp, cache) {
    const statuses = [metrics.status, smtp.status, cache.status];
    
    if (statuses.every(s => s === 'healthy')) {
      return 'healthy';
    }
    if (statuses.some(s => s === 'unhealthy')) {
      return 'unhealthy';
    }
    return 'degraded';
  }
}