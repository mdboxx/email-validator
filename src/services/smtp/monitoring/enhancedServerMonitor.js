import { EventEmitter } from 'events';
import { ServerValidator } from '../validation/serverValidator.js';
import { CircuitBreaker } from 'circuit-breaker-js';
import { logger } from '../../../utils/logger.js';

export class EnhancedServerMonitor extends EventEmitter {
  constructor() {
    super();
    this.validator = new ServerValidator();
    this.monitoringIntervals = new Map();
    this.healthHistory = new Map();
    this.circuitBreakers = new Map();
    this.setupMetricsCollection();
  }

  async startMonitoring(serverId, config = {}) {
    if (this.monitoringIntervals.has(serverId)) {
      return;
    }

    this.initializeCircuitBreaker(serverId, config);
    await this.checkServerHealth(serverId);

    const interval = setInterval(
      () => this.checkServerHealth(serverId),
      config.checkInterval || 5 * 60 * 1000 // Default: 5 minutes
    );

    this.monitoringIntervals.set(serverId, interval);
  }

  private initializeCircuitBreaker(serverId, config) {
    const breaker = new CircuitBreaker({
      windowDuration: config.windowDuration || 10000,
      numBuckets: config.numBuckets || 10,
      timeoutDuration: config.timeout || 5000,
      errorThreshold: config.errorThreshold || 50,
      volumeThreshold: config.volumeThreshold || 10
    });

    breaker.on('open', () => {
      logger.warn(`Circuit breaker opened for server ${serverId}`);
      this.emit('circuitOpen', { serverId, timestamp: new Date() });
    });

    breaker.on('close', () => {
      logger.info(`Circuit breaker closed for server ${serverId}`);
      this.emit('circuitClose', { serverId, timestamp: new Date() });
    });

    this.circuitBreakers.set(serverId, breaker);
  }

  async checkServerHealth(serverId) {
    try {
      const breaker = this.circuitBreakers.get(serverId);
      if (breaker && breaker.isOpen()) {
        return this.handleServerFailure(serverId, new Error('Circuit breaker open'));
      }

      const health = await this.validator.checkHealth(serverId);
      this.updateHealthHistory(serverId, health);
      this.emit('healthCheck', { serverId, health });

      if (!health.isHealthy) {
        breaker?.recordFailure();
      } else {
        breaker?.recordSuccess();
      }

      return health;
    } catch (error) {
      logger.error('Health check error:', error);
      return this.handleServerFailure(serverId, error);
    }
  }

  private handleServerFailure(serverId, error) {
    const health = {
      isHealthy: false,
      lastCheck: new Date().toISOString(),
      error: error.message
    };

    this.updateHealthHistory(serverId, health);
    this.emit('serverFailure', { serverId, error });
    return health;
  }

  private updateHealthHistory(serverId, health) {
    const history = this.healthHistory.get(serverId) || [];
    history.unshift(health);
    this.healthHistory.set(serverId, history.slice(0, 100)); // Keep last 100 checks
  }

  private setupMetricsCollection() {
    setInterval(() => {
      const metrics = {
        totalServers: this.monitoringIntervals.size,
        healthyServers: Array.from(this.healthHistory.entries())
          .filter(([, history]) => history[0]?.isHealthy)
          .length,
        openCircuits: Array.from(this.circuitBreakers.entries())
          .filter(([, breaker]) => breaker.isOpen())
          .length,
        timestamp: new Date().toISOString()
      };

      this.emit('metrics', metrics);
    }, 60000); // Collect metrics every minute
  }

  async getServerStatus(serverId) {
    const history = this.healthHistory.get(serverId) || [];
    const breaker = this.circuitBreakers.get(serverId);

    return {
      isMonitored: this.monitoringIntervals.has(serverId),
      lastCheck: history[0] || null,
      history: history.slice(0, 10),
      healthScore: this.calculateHealthScore(history),
      circuitBreakerStatus: breaker ? {
        isOpen: breaker.isOpen(),
        failureCount: breaker.getFailureCount(),
        lastFailure: breaker.getLastFailureTime()
      } : null
    };
  }

  private calculateHealthScore(history) {
    if (!history || history.length === 0) return 0;
    const recentChecks = history.slice(0, 10);
    const healthyChecks = recentChecks.filter(check => check.isHealthy).length;
    return (healthyChecks / recentChecks.length) * 100;
  }

  async stopMonitoring(serverId) {
    const interval = this.monitoringIntervals.get(serverId);
    if (interval) {
      clearInterval(interval);
      this.monitoringIntervals.delete(serverId);
      this.healthHistory.delete(serverId);
      this.circuitBreakers.delete(serverId);
    }
  }
}