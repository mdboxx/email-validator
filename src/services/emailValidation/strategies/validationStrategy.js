import { SyntaxValidator } from '../validators/syntaxValidator.js';
import { DomainValidator } from '../validators/domainValidator.js';
import { MxValidator } from '../validators/mxValidator.js';
import { SmtpValidator } from '../validators/smtpValidator.js';
import { ValidationResult } from '../../../utils/validation/validationResult.js';
import { logger } from '../../../utils/logger.js';

export class ValidationStrategy {
  constructor() {
    this.validators = [
      { name: 'syntax', validator: new SyntaxValidator() },
      { name: 'domain', validator: new DomainValidator() },
      { name: 'mx', validator: new MxValidator() },
      { name: 'smtp', validator: new SmtpValidator() }
    ];
  }

  async validate(email, state) {
    try {
      for (const { name, validator } of this.validators) {
        state.startStage(name);
        
        const result = await validator.validate(email);
        state.endStage(name, result.isValid, result);

        if (!result.isValid) {
          return result;
        }
      }

      return ValidationResult.success({
        email,
        validations: this.validators.map(v => v.name)
      });
    } catch (error) {
      logger.error('Validation strategy error:', error);
      state.addError(error);
      return ValidationResult.failure('Validation strategy failed');
    }
  }
}