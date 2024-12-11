import { logger } from '../../../utils/logger.js';
import { ValidationResult } from '../../../utils/validation/validationResult.js';
import { fileHandler } from '../../../utils/fileHandler.js';
import { createPath } from '../../../utils/pathUtils.js';
import { config } from '../../../config/index.js';

export class DisposableEmailDetector {
  constructor() {
    this.disposableDomains = new Set();
    this.lastUpdate = null;
    this.updateInterval = 24 * 60 * 60 * 1000; // 24 hours
  }

  async initialize() {
    try {
      await this.loadDisposableDomains();
      this.startPeriodicUpdate();
    } catch (error) {
      logger.error('Failed to initialize disposable email detector:', error);
    }
  }

  async loadDisposableDomains() {
    try {
      const domainsPath = createPath(config.dataDir, 'disposable-domains.json');
      const data = await fileHandler.readFile(domainsPath);
      const domains = JSON.parse(data);
      
      this.disposableDomains = new Set(domains);
      this.lastUpdate = new Date();
      
      logger.info(`Loaded ${this.disposableDomains.size} disposable domains`);
    } catch (error) {
      logger.error('Failed to load disposable domains:', error);
      throw error;
    }
  }

  async validate(email) {
    try {
      const domain = email.split('@')[1];
      const isDisposable = this.disposableDomains.has(domain);

      if (isDisposable) {
        return ValidationResult.failure('Disposable email domain detected', {
          domain,
          type: 'disposable'
        });
      }

      return ValidationResult.success({
        domain,
        type: 'regular'
      });
    } catch (error) {
      logger.error('Disposable email validation error:', error);
      return ValidationResult.failure('Disposable email validation failed');
    }
  }

  private startPeriodicUpdate() {
    setInterval(async () => {
      try {
        await this.loadDisposableDomains();
      } catch (error) {
        logger.error('Periodic update of disposable domains failed:', error);
      }
    }, this.updateInterval);
  }

  getLastUpdateTime() {
    return this.lastUpdate;
  }

  getDomainCount() {
    return this.disposableDomains.size;
  }
}