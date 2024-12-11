import { SmtpPool } from './smtpPool.js';
import { ConnectionConfig } from './connectionConfig.js';
import { logger } from '../../../utils/logger.js';

export class ConnectionManager {
  constructor() {
    this.pool = new SmtpPool();
    this.config = new ConnectionConfig();
  }

  async addServer(serverConfig) {
    try {
      const validatedConfig = this.config.validate(serverConfig);
      return await this.pool.addServer(validatedConfig);
    } catch (error) {
      logger.error('Error adding SMTP server:', error);
      throw error;
    }
  }

  async getConnection() {
    const connection = await this.pool.getConnection();
    if (!connection) {
      throw new Error('No available SMTP connections');
    }
    return connection;
  }

  async verifyEmail(email) {
    const connection = await this.getConnection();
    return connection.verifyEmail(email);
  }

  getPoolSize() {
    return this.pool.getServerCount();
  }

  removeServer(serverId) {
    return this.pool.removeServer(serverId);
  }
}