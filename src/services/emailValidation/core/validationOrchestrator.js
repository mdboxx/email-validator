import { ValidationResult } from '../../../utils/validation/validationResult.js';
import { logger } from '../../../utils/logger.js';
import { 
  SyntaxValidator, 
  DomainValidator, 
  MxValidator,
  SmtpValidator,
  DisposableValidator 
} from '../validators/index.js';

export class ValidationOrchestrator {
  constructor() {
    this.validators = [
      new SyntaxValidator(),
      new DomainValidator(),
      new MxValidator(),
      new SmtpValidator(),
      new DisposableValidator()
    ];
  }

  async validate(email) {
    try {
      const startTime = Date.now();
      const results = new Map();

      for (const validator of this.validators) {
        const result = await validator.validate(email);
        results.set(validator.constructor.name, result);

        if (!result.isValid) {
          return this.formatResult(email, results, startTime);
        }
      }

      return this.formatResult(email, results, startTime);
    } catch (error) {
      logger.error('Validation orchestration error:', error);
      return ValidationResult.failure('Validation process failed');
    }
  }

  formatResult(email, results, startTime) {
    const duration = Date.now() - startTime;
    const isValid = Array.from(results.values()).every(r => r.isValid);

    return {
      isValid,
      email,
      details: Object.fromEntries(results),
      metadata: {
        duration,
        timestamp: new Date().toISOString()
      }
    };
  }
}