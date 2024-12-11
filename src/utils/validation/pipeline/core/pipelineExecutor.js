import { ValidationContext } from '../context/validationContext.js';
import { ValidationResult } from '../../validationResult.js';
import { logger } from '../../../logger.js';

export class PipelineExecutor {
  constructor(pipeline) {
    this.pipeline = pipeline;
  }

  async execute(email, options = {}) {
    try {
      const context = new ValidationContext(email, options);
      const startTime = Date.now();
      
      const result = await this.pipeline.execute(context);
      const duration = Date.now() - startTime;

      return {
        ...result,
        metadata: {
          duration,
          metrics: context.metrics.getAllMetrics(),
          results: context.getAllResults(),
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error('Pipeline execution error:', error);
      return ValidationResult.failure('Pipeline execution failed');
    }
  }
}