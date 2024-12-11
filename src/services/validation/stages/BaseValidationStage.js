import { logger } from '../../../utils/logger.js';

export class BaseValidationStage {
  constructor(name) {
    this.name = name;
  }

  async execute(context) {
    try {
      const startTime = Date.now();
      const result = await this.validate(context);
      const duration = Date.now() - startTime;

      context.metrics.recordValidation(result, duration);
      return result;
    } catch (error) {
      logger.error(`Stage ${this.name} error:`, error);
      throw error;
    }
  }

  async validate(context) {
    throw new Error('validate method must be implemented by subclass');
  }
}