import { logger } from '../../../utils/logger.js';

export class ErrorCollector {
  constructor() {
    this.metrics = {
      total: 0,
      byType: {},
      byCode: {},
      recent: []
    };
  }

  record(error) {
    try {
      this.metrics.total++;
      this.updateErrorTypes(error);
      this.updateErrorCodes(error);
      this.addToRecent(error);
    } catch (err) {
      logger.error('Error recording error metrics:', err);
    }
  }

  private updateErrorTypes(error) {
    const type = error.name || 'Unknown';
    this.metrics.byType[type] = (this.metrics.byType[type] || 0) + 1;
  }

  private updateErrorCodes(error) {
    if (error.code) {
      this.metrics.byCode[error.code] = (this.metrics.byCode[error.code] || 0) + 1;
    }
  }

  private addToRecent(error) {
    this.metrics.recent.unshift({
      type: error.name || 'Unknown',
      message: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    });
    this.metrics.recent = this.metrics.recent.slice(0, 10); // Keep last 10 errors
  }

  getMetrics() {
    return {
      ...this.metrics,
      timestamp: new Date().toISOString()
    };
  }
}