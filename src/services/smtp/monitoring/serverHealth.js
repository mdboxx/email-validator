import { logger } from '../../../utils/logger.js';

export class ServerHealth {
  static readonly HEALTH_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
  static readonly MAX_CONSECUTIVE_FAILURES = 3;
  static readonly RECOVERY_THRESHOLD = 2;

  constructor() {
    this.healthStatus = new Map();
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

  private determineHealthStatus(status) {
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
}