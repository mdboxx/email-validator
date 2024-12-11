import { logger } from '../../utils/logger.js';

export class ValidationCache {
  constructor(options = {}) {
    this.cache = new Map();
    this.ttl = options.ttl || 3600000; // 1 hour default TTL
    this.maxSize = options.maxSize || 10000;
  }

  /**
   * Get cached validation result
   * @param {string} email Email address
   * @returns {Object|null} Cached result or null
   */
  get(email) {
    try {
      const entry = this.cache.get(email);
      if (!entry) return null;

      if (Date.now() > entry.expiresAt) {
        this.cache.delete(email);
        return null;
      }

      return entry.result;
    } catch (error) {
      logger.error('Cache retrieval error:', error);
      return null;
    }
  }

  /**
   * Store validation result in cache
   * @param {string} email Email address
   * @param {Object} result Validation result
   */
  set(email, result) {
    try {
      if (this.cache.size >= this.maxSize) {
        this.evictOldest();
      }

      this.cache.set(email, {
        result,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.ttl
      });
    } catch (error) {
      logger.error('Cache storage error:', error);
    }
  }

  /**
   * Remove oldest cache entries
   * @private
   */
  evictOldest() {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove 10% of oldest entries
    const removeCount = Math.ceil(this.maxSize * 0.1);
    entries.slice(0, removeCount).forEach(([key]) => {
      this.cache.delete(key);
    });
  }

  /**
   * Clear expired cache entries
   */
  clearExpired() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}