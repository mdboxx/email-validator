import Redis from 'ioredis';
import { logger } from '../../utils/logger.js';
import { RetryStrategy } from '../emailValidation/retry/retryStrategy.js';

export class RedisCacheManager {
  constructor(config) {
    this.config = {
      host: config.redis?.host || 'localhost',
      port: config.redis?.port || 6379,
      password: config.redis?.password,
      keyPrefix: 'email-validator:',
      retryStrategy: this.createRetryStrategy()
    };

    this.client = null;
    this.initializeClient();
  }

  private initializeClient() {
    this.client = new Redis({
      ...this.config,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        logger.warn(`Redis reconnection attempt ${times} in ${delay}ms`);
        return delay;
      },
      maxRetriesPerRequest: 3
    });

    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.on('error', (error) => {
      logger.error('Redis error:', error);
    });

    this.client.on('connect', () => {
      logger.info('Redis connected');
    });

    this.client.on('ready', () => {
      logger.info('Redis ready');
    });

    this.client.on('close', () => {
      logger.warn('Redis connection closed');
    });

    this.client.on('reconnecting', () => {
      logger.info('Redis reconnecting');
    });
  }

  async get(key) {
    return RetryStrategy.execute(async () => {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    }, {
      retries: 3,
      minTimeout: 100
    });
  }

  async set(key, value, ttl) {
    return RetryStrategy.execute(async () => {
      await this.client.set(
        key,
        JSON.stringify(value),
        'EX',
        Math.floor(ttl / 1000)
      );
      return true;
    }, {
      retries: 3,
      minTimeout: 100
    });
  }

  async delete(key) {
    return RetryStrategy.execute(async () => {
      await this.client.del(key);
      return true;
    });
  }

  async getStats() {
    try {
      const info = await this.client.info();
      const dbSize = await this.client.dbsize();
      
      return {
        connected: this.client.status === 'ready',
        dbSize,
        info: this.parseRedisInfo(info),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Redis stats error:', error);
      return null;
    }
  }

  private parseRedisInfo(info) {
    const result = {};
    info.split('\n').forEach(line => {
      const [key, value] = line.split(':');
      if (key && value) {
        result[key.trim()] = value.trim();
      }
    });
    return result;
  }

  private createRetryStrategy() {
    return function(times) {
      const delay = Math.min(times * 50, 2000);
      return delay;
    };
  }

  async shutdown() {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }
}