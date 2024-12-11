import { ValidationPipeline } from './ValidationPipeline.js';
import { ValidationContext } from './ValidationContext.js';
import { CacheService } from '../../services/cache/CacheService.js';
import { MetricsService } from '../../services/metrics/MetricsService.js';
import { logger } from '../../utils/logger.js';

export class ValidationService {
  constructor() {
    this.pipeline = new ValidationPipeline();
    this.cache = new CacheService();
    this.metrics = new MetricsService();
  }

  async validateEmail(email, options = {}) {
    const startTime = Date.now();
    try {
      // Check cache first
      if (!options.skipCache) {
        const cached = await this.cache.get(email);
        if (cached) {
          this.metrics.recordCacheHit();
          return cached;
        }
        this.metrics.recordCacheMiss();
      }

      const context = new ValidationContext(email, options);
      const result = await this.pipeline.execute(context);

      // Cache successful results
      if (result.isValid && !options.skipCache) {
        await this.cache.set(email, result);
      }

      // Record metrics
      const duration = Date.now() - startTime;
      this.metrics.recordValidation(result, duration);

      return result;
    } catch (error) {
      logger.error('Validation service error:', error);
      const duration = Date.now() - startTime;
      this.metrics.recordError(error, duration);
      throw error;
    }
  }

  async validateBulk(emails, options = {}) {
    const results = [];
    const batchSize = options.batchSize || 10;
    
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(email => this.validateEmail(email, options))
      );
      results.push(...batchResults);
    }

    return {
      total: emails.length,
      valid: results.filter(r => r.isValid).length,
      results
    };
  }
}