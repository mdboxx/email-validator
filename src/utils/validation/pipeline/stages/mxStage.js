import { BaseStage } from './baseStage.js';
import { MxValidator } from '../../validators/mxValidator.js';

export class MxStage extends BaseStage {
  constructor() {
    super('MX');
    this.validator = new MxValidator();
  }

  async validate(context) {
    const syntaxResult = context.getResult('Syntax');
    if (!syntaxResult?.details?.domain) {
      return ValidationResult.failure('Domain information not available');
    }

    const result = await this.validator.validate(syntaxResult.details.domain);
    context.setResult(this.name, result);
    return result;
  }
}