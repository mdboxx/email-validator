import { ValidationChain } from '../../../utils/validation/pipeline/validationChain.js';
import { ValidationStage } from '../../../utils/validation/pipeline/validationStage.js';
import { SyntaxValidator } from './syntaxValidator.js';
import { DomainValidator } from './domainValidator.js';
import { MxValidator } from './mxValidator.js';
import { logger } from '../../../utils/logger.js';

export class ValidationOrchestrator {
  constructor() {
    this.chain = new ValidationChain();
    this.setupValidationChain();
  }

  private setupValidationChain() {
    this.chain
      .addStage(new ValidationStage('Syntax', new SyntaxValidator()))
      .addStage(new ValidationStage('Domain', new DomainValidator()))
      .addStage(new ValidationStage('MX', new MxValidator()));
  }

  async validate(email) {
    try {
      const startTime = Date.now();
      const result = await this.chain.execute(email);
      const endTime = Date.now();

      return {
        ...result,
        metadata: {
          validationTime: endTime - startTime,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error('Validation orchestration error:', error);
      return {
        isValid: false,
        errors: ['Validation orchestration failed'],
        metadata: {
          error: error.message,
          timestamp: new Date().toISOString()
        }
      };
    }
  }
}