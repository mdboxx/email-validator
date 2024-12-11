import { ValidationPipeline } from './ValidationPipeline.js';
import { ValidationContext } from './ValidationContext.js';
import { logger } from '../../../utils/logger.js';

export class ValidationService {
  constructor(pipeline) {
    this.pipeline = pipeline || new ValidationPipeline();
  }

  async validate(email, options = {}) {
    try {
      const context = new ValidationContext(email, options);
      return await this.pipeline.execute(context);
    } catch (error) {
      logger.error('Validation service error:', error);
      throw error;
    }
  }
}