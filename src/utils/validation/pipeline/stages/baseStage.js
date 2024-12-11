import { ValidationResult } from '../../validationResult.js';
import { logger } from '../../../logger.js';

export class BaseStage {
  constructor(name) {
    this.name = name;
    this.nextStage = null;
  }

  setNext(stage) {
    this.nextStage = stage;
    return stage;
  }

  async execute(context) {
    try {
      const startTime = Date.now();
      const result = await this.validate(context);
      const duration = Date.now() - startTime;

      context.metrics.recordStage(this.name, duration, result.isValid);
      context.setResult(this.name, result);

      if (!result.isValid || !this.nextStage) {
        return result;
      }

      return this.nextStage.execute(context);
    } catch (error) {
      logger.error(`Stage ${this.name} error:`, error);
      return ValidationResult.failure(`${this.name} validation failed`);
    }
  }

  async validate(context) {
    throw new Error('validate method must be implemented by subclass');
  }
}