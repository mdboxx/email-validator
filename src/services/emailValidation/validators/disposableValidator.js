import { ValidationResult } from '../../../utils/validation/validationResult.js';
import { logger } from '../../../utils/logger.js';
import { readFileSync } from 'fs';
import { join } from 'path';

export class DisposableValidator {
  constructor() {
    this.disposableDomains = new Set();
    this.loadDisposableDomains();
  }

  loadDisposableDomains() {
    try {
      // Default list of known disposable domains
      const defaultDomains = [
        'tempmail.com',
        'throwawaymail.com',
        'guerrillamail.com',
        'mailinator.com',
        'yopmail.com',
        '10minutemail.com',
        'trashmail.com',
        'disposablemail.com'
      ];

      this.disposableDomains = new Set(defaultDomains);

      // Try to load additional domains from node_modules if available
      try {
        const modulePath = join(process.cwd(), 'node_modules', 'disposable-email-domains', 'index.json');
        const domains = JSON.parse(readFileSync(modulePath, 'utf8'));
        domains.forEach(domain => this.disposableDomains.add(domain));
      } catch (moduleError) {
        logger.warn('Could not load disposable-email-domains module, using default list');
      }
    } catch (error) {
      logger.error('Error loading disposable domains:', error);
    }
  }

  async validate(email) {
    try {
      const domain = email.split('@')[1].toLowerCase();
      const isDisposable = this.disposableDomains.has(domain);

      if (isDisposable) {
        return ValidationResult.failure('Disposable email domain detected', {
          domain,
          type: 'disposable'
        });
      }

      return ValidationResult.success({
        domain,
        isDisposable: false
      });
    } catch (error) {
      logger.error('Disposable validation error:', error);
      return ValidationResult.failure('Disposable validation failed');
    }
  }

  addDomain(domain) {
    this.disposableDomains.add(domain.toLowerCase());
  }

  removeDomain(domain) {
    this.disposableDomains.delete(domain.toLowerCase());
  }

  getDomainCount() {
    return this.disposableDomains.size;
  }
}