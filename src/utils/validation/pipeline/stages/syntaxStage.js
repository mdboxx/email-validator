import { BaseStage } from './baseStage.js';
import { SyntaxValidator } from '../../validators/syntaxValidator.js';

export class SyntaxStage extends BaseStage {
  constructor() {
    super('Syntax');
    this.validator = new SyntaxValidator();
  }

  async validate(context) {
    const result = await this.validator.validate(context.email);
    context.setResult(this.name, result);
    return result;
  }
}