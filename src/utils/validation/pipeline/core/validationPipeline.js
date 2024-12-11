import { ValidationResult } from '../../validationResult.js';
import { logger } from '../../../logger.js';

export class ValidationPipeline {
  constructor() {
    this.stages = [];
  }

  addStage(stage) {
    this.stages.push(stage);
    return this;
  }

  removeStage(stageName) {
    this.stages = this.stages.filter(stage => stage.name !== stageName);
    return this;
  }

  async execute(context) {
    try {
      for (const stage of this.stages) {
        const result = await stage.execute(context);
        if (!result.isValid) {
          return result;
        }
      }

      return ValidationResult.success({
        email: context.email,
        stages: this.stages.map(stage => stage.name)
      });
    } catch (error) {
      logger.error('Pipeline execution error:', error);
      return ValidationResult.failure('Pipeline execution failed');
    }
  }
}