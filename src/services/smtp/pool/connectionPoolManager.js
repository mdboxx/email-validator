import { ConnectionPool } from './connectionPool.js';
import { logger } from '../../../utils/logger.js';

export class ConnectionPoolManager {
  constructor(options = {}) {
    this.pools = new Map();
    this.defaultOptions = {
      maxConnections: 10,
      minConnections: 2,
      idleTimeout: 30000,
      ...options
    };
  }

  async getPool(serverId) {
    if (!this.pools.has(serverId)) {
      const pool = new ConnectionPool(this.defaultOptions);
      await pool.initialize();
      this.pools.set(serverId, pool);
    }
    return this.pools.get(serverId);
  }

  async acquireConnection(serverId) {
    try {
      const pool = await this.getPool(serverId);
      return await pool.acquire();
    } catch (error) {
      logger.error(`Error acquiring connection for server ${serverId}:`, error);
      throw error;
    }
  }

  async releaseConnection(serverId, connection) {
    const pool = this.pools.get(serverId);
    if (pool) {
      await pool.release(connection);
    }
  }

  async shutdown() {
    const shutdowns = Array.from(this.pools.values()).map(pool => pool.shutdown());
    await Promise.all(shutdowns);
    this.pools.clear();
  }

  getStats() {
    const stats = {};
    for (const [serverId, pool] of this.pools.entries()) {
      stats[serverId] = pool.getStats();
    }
    return stats;
  }
}