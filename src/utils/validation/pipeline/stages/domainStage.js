import { BaseStage } from './baseStage.js';
import { DomainValidator } from '../../validators/domainValidator.js';

export class DomainStage extends BaseStage {
  constructor() {
    super('Domain');
    this.validator = new DomainValidator();
  }

  async validate(context) {
    const result = await this.validator.validate(context.email);
    context.setResult(this.name, result);
    return result;
  }
}