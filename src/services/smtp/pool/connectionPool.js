import { SmtpConnection } from '../connection/smtpConnection.js';
import { logger } from '../../../utils/logger.js';

export class ConnectionPool {
  constructor(options = {}) {
    this.maxConnections = options.maxConnections || 10;
    this.minConnections = options.minConnections || 2;
    this.idleTimeout = options.idleTimeout || 30000;
    this.connections = new Map();
    this.available = [];
    this.waiting = [];
  }

  async initialize(serverConfig) {
    try {
      for (let i = 0; i < this.minConnections; i++) {
        const connection = await this.createConnection(serverConfig);
        this.addConnection(connection);
      }
      logger.info(`Initialized connection pool with ${this.minConnections} connections`);
    } catch (error) {
      logger.error('Pool initialization error:', error);
      throw error;
    }
  }

  async acquire() {
    if (this.available.length > 0) {
      return this.available.pop();
    }

    if (this.connections.size < this.maxConnections) {
      const connection = await this.createConnection();
      this.addConnection(connection);
      return connection;
    }

    return new Promise((resolve) => {
      this.waiting.push(resolve);
      setTimeout(() => {
        const index = this.waiting.indexOf(resolve);
        if (index !== -1) {
          this.waiting.splice(index, 1);
          resolve(null);
        }
      }, this.idleTimeout);
    });
  }

  release(connection) {
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift();
      resolve(connection);
    } else {
      this.available.push(connection);
    }
  }

  private async createConnection(config) {
    const connection = new SmtpConnection(config);
    await connection.connect();
    return connection;
  }

  private addConnection(connection) {
    const id = Math.random().toString(36).substr(2, 9);
    this.connections.set(id, {
      connection,
      lastUsed: Date.now()
    });
    this.available.push(connection);
  }

  async shutdown() {
    for (const [id, { connection }] of this.connections) {
      connection.disconnect();
      this.connections.delete(id);
    }
    this.available = [];
    this.waiting = [];
  }

  getStats() {
    return {
      total: this.connections.size,
      available: this.available.length,
      waiting: this.waiting.length,
      timestamp: new Date().toISOString()
    };
  }
}