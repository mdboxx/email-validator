export class SystemMetricsCollector {
  collectMetrics() {
    const memory = process.memoryUsage();
    
    return {
      memory: {
        heapUsed: memory.heapUsed,
        heapTotal: memory.heapTotal,
        external: memory.external,
        rss: memory.rss
      },
      uptime: process.uptime(),
      cpu: process.cpuUsage(),
      timestamp: new Date().toISOString()
    };
  }
}