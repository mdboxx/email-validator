import { SmtpConnectionManager } from './connectionManager.js';
import { ServerHealth } from './serverHealth.js';
import { logger } from '../../utils/logger.js';

export class ServerMonitor {
  constructor() {
    this.serverHealth = new ServerHealth();
    this.monitoringStatus = new Map();
  }

  async checkServerHealth(server) {
    try {
      const isConnected = await SmtpConnectionManager.testConnection(server);
      const healthStatus = this.serverHealth.updateServerHealth(
        server.host,
        isConnected
      );

      this.updateMonitoringStatus(server.host, {
        lastCheck: new Date(),
        status: isConnected ? 'healthy' : 'unhealthy',
        details: healthStatus
      });

      return healthStatus;
    } catch (error) {
      logger.error(`Health check failed for ${server.host}:`, error);
      return this.serverHealth.updateServerHealth(server.host, false);
    }
  }

  updateMonitoringStatus(serverId, status) {
    this.monitoringStatus.set(serverId, {
      ...status,
      history: [
        ...(this.monitoringStatus.get(serverId)?.history || []).slice(-9),
        status
      ]
    });
  }

  getServerStatus(serverId) {
    return {
      health: this.serverHealth.getServerHealth(serverId),
      monitoring: this.monitoringStatus.get(serverId) || {
        lastCheck: null,
        status: 'unknown',
        history: []
      }
    };
  }

  getAllServerStatuses() {
    const statuses = new Map();
    for (const [serverId] of this.monitoringStatus) {
      statuses.set(serverId, this.getServerStatus(serverId));
    }
    return statuses;
  }
}