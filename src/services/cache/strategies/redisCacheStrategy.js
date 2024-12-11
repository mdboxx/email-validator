import Redis from 'ioredis';
import { logger } from '../../../utils/logger.js';
import { config } from '../../../config/index.js';

export class RedisCacheStrategy {
  constructor() {
    this.client = new Redis({
      host: config.redis?.host || 'localhost',
      port: config.redis?.port || 6379,
      password: config.redis?.password,
      keyPrefix: 'email-validator:',
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
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

  async set(key, value, ttl) {
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