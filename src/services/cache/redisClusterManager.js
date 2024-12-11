import Redis from 'ioredis';
import { logger } from '../../utils/logger.js';

export class RedisClusterManager {
  constructor(config) {
    this.nodes = config.nodes || [
      { host: 'localhost', port: 6379 }
    ];
    this.options = {
      redisOptions: {
        password: config.password,
        connectTimeout: 10000,
        maxRetriesPerRequest: 3
      },
      ...config.options
    };
    this.cluster = null;
  }

  async connect() {
    try {
      this.cluster = new Redis.Cluster(this.nodes, {
        ...this.options,
        scaleReads: 'slave',
        clusterRetryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        }
      });

      this.setupEventHandlers();
      await this.validateConnection();
      logger.info('Redis cluster connected successfully');
    } catch (error) {
      logger.error('Redis cluster connection error:', error);
      throw error;
    }
  }

  private setupEventHandlers() {
    this.cluster.on('+node', (node) => {
      logger.info(`Redis node added: ${node}`);
    });

    this.cluster.on('-node', (node) => {
      logger.info(`Redis node removed: ${node}`);
    });

    this.cluster.on('error', (error) => {
      logger.error('Redis cluster error:', error);
    });
  }

  private async validateConnection() {
    const nodes = await this.cluster.cluster('nodes');
    if (!nodes || nodes.length === 0) {
      throw new Error('No Redis cluster nodes available');
    }
  }

  async get(key) {
    try {
      const value = await this.cluster.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis cluster get error:', error);
      return null;
    }
  }

  async set(key, value, ttl) {
    try {
      await this.cluster.set(
        key,
        JSON.stringify(value),
        'EX',
        Math.floor(ttl / 1000)
      );
      return true;
    } catch (error) {
      logger.error('Redis cluster set error:', error);
      return false;
    }
  }

  async getClusterInfo() {
    try {
      const nodes = await this.cluster.cluster('nodes');
      const info = await this.cluster.cluster('info');
      
      return {
        nodes: nodes.length,
        state: info.cluster_state,
        slots_assigned: info.cluster_slots_assigned,
        slots_ok: info.cluster_slots_ok,
        known_nodes: info.cluster_known_nodes,
        size: info.cluster_size,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Error getting cluster info:', error);
      return null;
    }
  }

  async shutdown() {
    if (this.cluster) {
      await this.cluster.quit();
      this.cluster = null;
    }
  }
}