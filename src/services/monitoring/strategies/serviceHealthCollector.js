import { logger } from '../../../utils/logger.js';

export class ServiceHealthCollector {
  constructor(services) {
    this.services = services;
  }

  async collectHealth() {
    const results = await Promise.all(
      Object.entries(this.services).map(async ([name, service]) => {
        try {
          const status = await service.checkHealth();
          return [name, status];
        } catch (error) {
          logger.error(`Health check failed for ${name}:`, error);
          return [name, { healthy: false, error: error.message }];
        }
      })
    );

    return Object.fromEntries(results);
  }

  determineOverallStatus(serviceStatuses) {
    const statuses = Object.values(serviceStatuses);
    const allHealthy = statuses.every(status => status.healthy);
    const anyHealthy = statuses.some(status => status.healthy);

    if (allHealthy) return 'healthy';
    if (anyHealthy) return 'degraded';
    return 'unhealthy';
  }
}