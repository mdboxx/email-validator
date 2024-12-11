export class ServerValidator {
  static isAvailable(server) {
    const FAILURE_THRESHOLD = 3;
    const COOLDOWN_PERIOD = 5 * 60 * 1000; // 5 minutes

    if (!server) {
      return false;
    }

    if (server.failureCount >= FAILURE_THRESHOLD) {
      const timeSinceFailure = Date.now() - (server.lastFailure || 0);
      if (timeSinceFailure < COOLDOWN_PERIOD) {
        return false;
      }
      return true;
    }

    return true;
  }

  static getServerStatus(server) {
    if (!server) {
      return {
        available: false,
        reason: 'Server configuration not found'
      };
    }

    const available = this.isAvailable(server);
    const status = {
      available,
      failureCount: server.failureCount || 0,
      lastFailure: server.lastFailure,
      reason: available ? null : 'Server in cooldown period'
    };

    return status;
  }
}