export class BaseMetricsCollector {
  constructor() {
    if (this.constructor === BaseMetricsCollector) {
      throw new Error('BaseMetricsCollector cannot be instantiated directly');
    }
  }

  async collect() {
    throw new Error('collect method must be implemented by subclass');
  }

  reset() {
    throw new Error('reset method must be implemented by subclass');
  }
}