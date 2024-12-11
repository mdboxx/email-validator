export class ValidationConfig {
  constructor(options = {}) {
    this.config = {
      validation: {
        maxLocalPartLength: options.maxLocalPartLength || 64,
        maxDomainLength: options.maxDomainLength || 255,
        maxTotalLength: options.maxTotalLength || 254,
        allowedSpecialChars: options.allowedSpecialChars || '!#$%&\'*+-/=?^_`{|}~.',
        requireMx: options.requireMx ?? true,
        checkDisposable: options.checkDisposable ?? true,
        checkRoleBased: options.checkRoleBased ?? true,
        checkCatchAll: options.checkCatchAll ?? false
      },
      cache: {
        enabled: options.cacheEnabled ?? true,
        ttl: options.cacheTtl || 3600000, // 1 hour
        maxSize: options.cacheMaxSize || 10000
      },
      smtp: {
        enabled: options.smtpEnabled ?? true,
        timeout: options.smtpTimeout || 5000,
        retryAttempts: options.smtpRetryAttempts || 3,
        retryDelay: options.smtpRetryDelay || 1000
      },
      metrics: {
        enabled: options.metricsEnabled ?? true,
        detailed: options.detailedMetrics ?? true,
        histogramBuckets: options.histogramBuckets || [100, 250, 500, 1000, 2500, 5000]
      }
    };
  }

  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.config);
  }

  set(path, value) {
    const parts = path.split('.');
    const last = parts.pop();
    const target = parts.reduce((obj, key) => obj[key] = obj[key] || {}, this.config);
    target[last] = value;
  }

  getValidationRules() {
    return this.config.validation;
  }

  getCacheConfig() {
    return this.config.cache;
  }

  getSmtpConfig() {
    return this.config.smtp;
  }

  getMetricsConfig() {
    return this.config.metrics;
  }

  toJSON() {
    return { ...this.config };
  }
}