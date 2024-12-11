import { SyntaxValidationStage } from '../stages/SyntaxValidationStage.js';
import { DomainValidationStage } from '../stages/DomainValidationStage.js';
import { DisposableValidationStage } from '../stages/DisposableValidationStage.js';
import { SmtpValidationStage } from '../stages/SmtpValidationStage.js';
import { logger } from '../../../utils/logger.js';

export class ValidationPipeline {
  constructor() {
    this.stages = [
      new SyntaxValidationStage(),
      new DomainValidationStage(),
      new DisposableValidationStage(),
      new SmtpValidationStage()
    ];
  }

  async execute(context) {
    try {
      for (const stage of this.stages) {
        const result = await stage.execute(context);
        
        if (!result.isValid) {
          return result;
        }
      }

      return {
        isValid: true,
        email: context.email,
        details: Object.fromEntries(context.results),
        duration: context.getDuration(),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Validation pipeline error:', error);
      throw error;
    }
  }
}