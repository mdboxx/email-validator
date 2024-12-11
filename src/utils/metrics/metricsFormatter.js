export class MetricsFormatter {
  static formatDuration(ms) {
    if (ms < 1000) return `${ms}ms`;
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    }
    return `${seconds}s`;
  }

  static formatPercentage(value, decimals = 2) {
    return `${value.toFixed(decimals)}%`;
  }

  static formatTimestamp(date) {
    return new Date(date).toISOString();
  }

  static formatMetrics(metrics) {
    return {
      ...metrics,
      performance: {
        ...metrics.performance,
        averageResponseTime: `${metrics.performance.averageResponseTime.toFixed(2)}ms`,
        totalDuration: this.formatDuration(metrics.performance.totalResponseTime)
      },
      successRate: this.formatPercentage(metrics.successRate),
      timestamp: this.formatTimestamp(metrics.timestamp)
    };
  }
}