import { BaseValidationStage } from './BaseValidationStage.js';
import { EmailRules } from '../rules/EmailRules.js';
import { ValidationResult } from '../results/ValidationResult.js';

export class SyntaxValidationStage extends BaseValidationStage {
  constructor() {
    super('syntax');
  }

  async execute(context) {
    const { email } = context;
    const errors = EmailRules.validateSyntax(email);

    const result = errors.length === 0
      ? ValidationResult.success({ email })
      : ValidationResult.failure(errors);

    context.addResult(this.name, result);
    return result;
  }
}