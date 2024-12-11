export class ValidationOptions {
  constructor(options = {}) {
    this.retryAttempts = options.retryAttempts;
    this.timeout = options.timeout;
    this.skipCache = options.skipCache || false;
    this.forceFresh = options.forceFresh || false;
  }

  static getDefaults() {
    return {
      retryAttempts: 3,
      timeout: 5000,
      skipCache: false,
      forceFresh: false
    };
  }

  merge(options) {
    return new ValidationOptions({
      ...this,
      ...options
    });
  }
}