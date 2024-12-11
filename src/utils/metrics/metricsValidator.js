export class MetricsValidator {
  static validateMetrics(metrics) {
    const required = [
      'validations.total',
      'validations.successful',
      'validations.failed',
      'errors.syntax',
      'errors.domain',
      'errors.mx',
      'errors.smtp',
      'performance.totalResponseTime',
      'performance.averageResponseTime'
    ];

    const missing = required.filter(path => {
      const parts = path.split('.');
      let current = metrics;
      for (const part of parts) {
        if (current[part] === undefined) return true;
        current = current[part];
      }
      return false;
    });

    return {
      isValid: missing.length === 0,
      missing
    };
  }

  static validatePerformanceMetrics(metrics) {
    const { performance } = metrics;
    
    return {
      isValid: 
        typeof performance.totalResponseTime === 'number' &&
        typeof performance.averageResponseTime === 'number' &&
        performance.totalResponseTime >= 0 &&
        performance.averageResponseTime >= 0,
      errors: []
    };
  }
}