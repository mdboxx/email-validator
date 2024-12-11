import { ServerPool } from '../pool/serverPool.js';
import { ServerValidator } from '../validation/serverValidator.js';
import { ServerMonitor } from '../monitoring/serverMonitor.js';
import { logger } from '../../../utils/logger.js';

export class ServerManager {
  constructor() {
    this.pool = new ServerPool();
    this.validator = new ServerValidator();
    this.monitor = new ServerMonitor();
  }

  async addServer(server) {
    try {
      const validationResult = await this.validator.validate(server);
      if (!validationResult.isValid) {
        return {
          success: false,
          error: validationResult.errors.join(', ')
        };
      }

      const serverId = this.pool.addServer(server);
      await this.monitor.startMonitoring(serverId);

      return {
        success: true,
        serverId,
        status: await this.monitor.getStatus(serverId)
      };
    } catch (error) {
      logger.error('Error adding SMTP server:', error);
      throw error;
    }
  }

  async removeServer(serverId) {
    await this.monitor.stopMonitoring(serverId);
    return this.pool.removeServer(serverId);
  }

  async getServerStatus(serverId) {
    return {
      server: this.pool.getServer(serverId),
      status: await this.monitor.getStatus(serverId),
      health: await this.validator.checkHealth(serverId)
    };
  }

  async getAllServerStatuses() {
    const servers = this.pool.getAllServers();
    return Promise.all(
      servers.map(server => this.getServerStatus(server.id))
    );
  }
}