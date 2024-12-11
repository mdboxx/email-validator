import { fileHandler } from '../../../utils/fileHandler.js';
import { createPath } from '../../../utils/pathUtils.js';
import { config } from '../../../config/index.js';
import { logger } from '../../../utils/logger.js';
import disposableDomains from 'disposable-email-domains';

export class DisposableDomainsManager {
  constructor() {
    this.domains = new Set();
    this.lastUpdate = null;
    this.updateInterval = 24 * 60 * 60 * 1000; // 24 hours
  }

  async initialize() {
    try {
      await this.loadDomains();
      this.startPeriodicUpdate();
      logger.info(`Initialized with ${this.domains.size} disposable domains`);
    } catch (error) {
      logger.error('Failed to initialize disposable domains manager:', error);
      throw error;
    }
  }

  async loadDomains() {
    try {
      // Load from npm package
      this.domains = new Set([...disposableDomains]);

      // Load custom domains if they exist
      const customDomainsPath = createPath(config.dataDir, 'custom-disposable-domains.json');
      try {
        const customData = await fileHandler.readFile(customDomainsPath);
        const customDomains = JSON.parse(customData);
        customDomains.forEach(domain => this.domains.add(domain));
      } catch (error) {
        logger.debug('No custom disposable domains found');
      }

      this.lastUpdate = new Date();
    } catch (error) {
      logger.error('Failed to load disposable domains:', error);
      throw error;
    }
  }

  isDisposable(domain) {
    return this.domains.has(domain.toLowerCase());
  }

  async addCustomDomain(domain) {
    try {
      this.domains.add(domain.toLowerCase());
      await this.saveCustomDomains();
      logger.info(`Added custom disposable domain: ${domain}`);
      return true;
    } catch (error) {
      logger.error('Failed to add custom disposable domain:', error);
      return false;
    }
  }

  private async saveCustomDomains() {
    const customDomainsPath = createPath(config.dataDir, 'custom-disposable-domains.json');
    const customDomains = Array.from(this.domains);
    await fileHandler.writeFile(customDomainsPath, JSON.stringify(customDomains, null, 2));
  }

  private startPeriodicUpdate() {
    setInterval(async () => {
      try {
        await this.loadDomains();
        logger.info('Periodic update of disposable domains completed');
      } catch (error) {
        logger.error('Periodic update of disposable domains failed:', error);
      }
    }, this.updateInterval);
  }

  getStats() {
    return {
      totalDomains: this.domains.size,
      lastUpdate: this.lastUpdate,
      timestamp: new Date().toISOString()
    };
  }
}