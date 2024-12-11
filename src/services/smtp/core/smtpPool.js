import { SmtpConnection } from './smtpConnection.js';
import { logger } from '../../../utils/logger.js';

export class SmtpPool {
  constructor() {
    this.connections = new Map();
    this.currentIndex = 0;
  }

  async addServer(config) {
    const connection = new SmtpConnection(config);
    const isConnected = await connection.connect();

    if (!isConnected) {
      throw new Error('Failed to connect to SMTP server');
    }

    const serverId = `${config.host}:${config.port}`;
    this.connections.set(serverId, {
      connection,
      config,
      lastUsed: null
    });

    return serverId;
  }

  async getConnection() {
    const servers = Array.from(this.connections.values());
    if (servers.length === 0) {
      return null;
    }

    const server = servers[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % servers.length;
    server.lastUsed = new Date();

    return server.connection;
  }

  removeServer(serverId) {
    const server = this.connections.get(serverId);
    if (server) {
      server.connection.disconnect();
      this.connections.delete(serverId);
    }
  }

  getServerCount() {
    return this.connections.size;
  }
}