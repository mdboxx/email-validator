import { logger } from '../../../utils/logger.js';

export class MemoryCacheStrategy {
  constructor(options = {}) {
    this.cache = new Map();
    this.ttl = options.ttl || 3600000;
    this.maxSize = options.maxSize || 10000;
  }

  get(key) {
    try {
      const entry = this.cache.get(key);
      if (!entry) return null;

      if (Date.now() > entry.expiresAt) {
        this.cache.delete(key);
        return null;
      }

      return entry.value;
    } catch (error) {
      logger.error('Memory cache get error:', error);
      return null;
    }
  }

  set(key, value, ttl = this.ttl) {
    try {
      if (this.cache.size >= this.maxSize) {
        this.evictOldest();
      }

      this.cache.set(key, {
        value,
        createdAt: Date.now(),
        expiresAt: Date.now() + ttl
      });
      return true;
    } catch (error) {
      logger.error('Memory cache set error:', error);
      return false;
    }
  }

  private evictOldest() {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].createdAt - b[1].createdAt);
    
    const removeCount = Math.ceil(this.maxSize * 0.1);
    entries.slice(0, removeCount).forEach(([key]) => {
      this.cache.delete(key);
    });
  }

  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttl: this.ttl
    };
  }
}