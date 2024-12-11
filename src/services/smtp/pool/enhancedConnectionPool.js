import genericPool from 'generic-pool';
import { SmtpConnection } from '../connection/smtpConnection.js';
import { logger } from '../../../utils/logger.js';

export class EnhancedConnectionPool {
  constructor(config) {
    this.config = config;
    this.pool = genericPool.createPool({
      create: async () => {
        const connection = new SmtpConnection(this.config);
        await connection.connect();
        return connection;
      },
      destroy: async (connection) => {
        await connection.disconnect();
      },
      validate: async (connection) => {
        try {
          return await connection.validate();
        } catch (error) {
          return false;
        }
      }
    }, {
      max: 10,
      min: 2,
      acquireTimeoutMillis: 5000,
      evictionRunIntervalMillis: 30000,
      numTestsPerEvictionRun: 3,
      idleTimeoutMillis: 30000,
      testOnBorrow: true
    });

    this.setupMetrics();
  }

  async acquire() {
    try {
      return await this.pool.acquire();
    } catch (error) {
      logger.error('Connection pool acquisition error:', error);
      throw error;
    }
  }

  async release(connection) {
    try {
      await this.pool.release(connection);
    } catch (error) {
      logger.error('Connection pool release error:', error);
      throw error;
    }
  }

  async withConnection(callback) {
    let connection;
    try {
      connection = await this.acquire();
      return await callback(connection);
    } finally {
      if (connection) {
        await this.release(connection);
      }
    }
  }

  private setupMetrics() {
    setInterval(() => {
      const metrics = {
        size: this.pool.size,
        available: this.pool.available,
        borrowed: this.pool.borrowed,
        pending: this.pool.pending,
        timestamp: new Date().toISOString()
      };
      logger.debug('Connection pool metrics:', metrics);
    }, 60000);
  }

  async shutdown() {
    await this.pool.drain();
    await this.pool.clear();
  }
}