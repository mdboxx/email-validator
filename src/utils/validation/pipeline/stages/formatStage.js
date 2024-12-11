import { BaseStage } from './baseStage.js';
import { EmailFormatValidator } from './validators/emailFormatValidator.js';

export class FormatStage extends BaseStage {
  constructor() {
    super('Format');
  }

  async validate(context) {
    return EmailFormatValidator.validate(context.email);
  }
}