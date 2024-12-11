import { EventEmitter } from 'events';
import { ServerValidator } from '../validation/serverValidator.js';
import { logger } from '../../../utils/logger.js';

export class ServerMonitor extends EventEmitter {
  constructor() {
    super();
    this.validator = new ServerValidator();
    this.monitoringIntervals = new Map();
    this.healthHistory = new Map();
  }

  async startMonitoring(serverId) {
    if (this.monitoringIntervals.has(serverId)) {
      return;
    }

    await this.checkServerHealth(serverId);
    const interval = setInterval(
      () => this.checkServerHealth(serverId),
      5 * 60 * 1000 // Check every 5 minutes
    );

    this.monitoringIntervals.set(serverId, interval);
  }

  async stopMonitoring(serverId) {
    const interval = this.monitoringIntervals.get(serverId);
    if (interval) {
      clearInterval(interval);
      this.monitoringIntervals.delete(serverId);
      this.healthHistory.delete(serverId);
    }
  }

  async getStatus(serverId) {
    const history = this.healthHistory.get(serverId) || [];
    const lastCheck = history[0] || null;

    return {
      isMonitored: this.monitoringIntervals.has(serverId),
      lastCheck,
      history: history.slice(0, 10),
      healthScore: this.calculateHealthScore(history)
    };
  }

  private async checkServerHealth(serverId) {
    try {
      const health = await this.validator.checkHealth(serverId);
      this.updateHealthHistory(serverId, health);
      this.emit('healthCheck', { serverId, health });
      return health;
    } catch (error) {
      logger.error('Health check error:', error);
      const health = {
        isHealthy: false,
        lastCheck: new Date().toISOString(),
        error: error.message
      };
      this.updateHealthHistory(serverId, health);
      this.emit('healthCheck', { serverId, health });
      return health;
    }
  }

  private updateHealthHistory(serverId, health) {
    const history = this.healthHistory.get(serverId) || [];
    history.unshift(health);
    this.healthHistory.set(serverId, history.slice(0, 100)); // Keep last 100 checks
  }

  private calculateHealthScore(history) {
    if (!history || history.length === 0) return 0;
    const recentChecks = history.slice(0, 10);
    const healthyChecks = recentChecks.filter(check => check.isHealthy).length;
    return (healthyChecks / recentChecks.length) * 100;
  }
}