import { ServerPool } from './serverPool.js';
import { ServerMonitor } from './serverMonitor.js';
import { ServerValidator } from './serverValidator.js';
import { logger } from '../../utils/logger.js';

export class ServerManager {
  constructor() {
    this.pool = new ServerPool();
    this.monitor = new ServerMonitor();
  }

  async addServer(config) {
    try {
      if (!ServerValidator.isValid(config)) {
        throw new Error('Invalid server configuration');
      }

      const serverId = this.pool.addServer(config);
      await this.monitor.checkServerHealth(config);
      
      return serverId;
    } catch (error) {
      logger.error('Error adding SMTP server:', error);
      throw error;
    }
  }

  async getAvailableServer() {
    const server = await this.pool.getNextAvailableServer();
    if (!server) {
      throw new Error('No available SMTP servers');
    }
    return server;
  }

  removeServer(serverId) {
    return this.pool.removeServer(serverId);
  }

  getServerStatus(serverId) {
    return this.pool.getServerStatus(serverId);
  }

  getAllServerStatuses() {
    return this.pool.getAllServerStatuses();
  }
}