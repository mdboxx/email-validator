export const metricsConfig = {
  validation: {
    durationBuckets: [0.1, 0.5, 1, 2, 5],
    labels: ['status', 'validation_type']
  },
  smtp: {
    latencyBuckets: [0.1, 0.5, 1, 2, 5],
    connectionTimeout: 5000
  },
  cache: {
    enabled: true,
    recordHits: true,
    recordMisses: true
  },
  performance: {
    collectInterval: 60000, // 1 minute
    eventLoopMonitoring: true
  }
};