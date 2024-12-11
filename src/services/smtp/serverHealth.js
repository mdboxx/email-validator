import { logger } from '../../utils/logger.js';

export class ServerHealth {
  static HEALTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
  static MAX_CONSECUTIVE_FAILURES = 3;
  static RECOVERY_THRESHOLD = 2;

  constructor() {
    this.healthStatus = new Map();
    this.startHealthChecks();
  }

  updateServerHealth(serverId, isHealthy) {
    const status = this.healthStatus.get(serverId) || {
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
      lastCheck: null,
      isHealthy: true
    };

    if (isHealthy) {
      status.consecutiveSuccesses++;
      status.consecutiveFailures = 0;
    } else {
      status.consecutiveFailures++;
      status.consecutiveSuccesses = 0;
    }

    status.lastCheck = new Date();
    status.isHealthy = this.determineHealthStatus(status);

    this.healthStatus.set(serverId, status);
    return status;
  }

  determineHealthStatus(status) {
    if (status.consecutiveFailures >= ServerHealth.MAX_CONSECUTIVE_FAILURES) {
      return false;
    }
    if (status.consecutiveSuccesses >= ServerHealth.RECOVERY_THRESHOLD) {
      return true;
    }
    return status.isHealthy;
  }

  getServerHealth(serverId) {
    return this.healthStatus.get(serverId) || {
      isHealthy: true,
      consecutiveFailures: 0,
      consecutiveSuccesses: 0,
      lastCheck: null
    };
  }

  startHealthChecks() {
    setInterval(() => {
      try {
        this.performHealthChecks();
      } catch (error) {
        logger.error('Health check error:', error);
      }
    }, ServerHealth.HEALTH_CHECK_INTERVAL);
  }

  async performHealthChecks() {
    const now = new Date();
    for (const [serverId, status] of this.healthStatus.entries()) {
      if (!status.lastCheck || 
          (now.getTime() - status.lastCheck.getTime() >= ServerHealth.HEALTH_CHECK_INTERVAL)) {
        logger.info(`Performing health check for server ${serverId}`);
        // Health check logic will be implemented by the ServerMonitor
      }
    }
  }
}