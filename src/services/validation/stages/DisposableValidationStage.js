import { BaseValidationStage } from './BaseValidationStage.js';
import { ValidationResult } from '../results/ValidationResult.js';
import disposableDomains from 'disposable-email-domains';

export class DisposableValidationStage extends BaseValidationStage {
  constructor() {
    super('disposable');
    this.disposableDomains = new Set(disposableDomains);
  }

  async validate(context) {
    const domain = context.email.split('@')[1];
    
    if (this.disposableDomains.has(domain.toLowerCase())) {
      return ValidationResult.failure(['Disposable email domains not allowed']);
    }

    return ValidationResult.success({
      domain,
      isDisposable: false
    });
  }
}