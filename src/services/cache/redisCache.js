import Redis from 'ioredis';
import { logger } from '../../utils/logger.js';
import { config } from '../../config/index.js';

export class RedisCache {
  constructor() {
    this.client = new Redis({
      host: config.redis?.host || 'localhost',
      port: config.redis?.port || 6379,
      password: config.redis?.password,
      keyPrefix: 'email-validator:'
    });

    this.client.on('error', (error) => {
      logger.error('Redis cache error:', error);
    });
  }

  async get(key) {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      logger.error('Redis get error:', error);
      return null;
    }
  }

  async set(key, value, ttl = config.cache.ttl) {
    try {
      await this.client.set(
        key,
        JSON.stringify(value),
        'EX',
        Math.floor(ttl / 1000)
      );
      return true;
    } catch (error) {
      logger.error('Redis set error:', error);
      return false;
    }
  }

  async delete(key) {
    try {
      await this.client.del(key);
      return true;
    } catch (error) {
      logger.error('Redis delete error:', error);
      return false;
    }
  }

  async flush() {
    try {
      await this.client.flushdb();
      return true;
    } catch (error) {
      logger.error('Redis flush error:', error);
      return false;
    }
  }

  async getStats() {
    try {
      const info = await this.client.info();
      return {
        connected: this.client.status === 'ready',
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
}