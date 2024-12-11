import { ConnectionManager } from '../connection/connectionManager.js';
import { ValidationResult } from '../../../utils/validation/validationResult.js';
import { logger } from '../../../utils/logger.js';

export class ServerValidator {
  constructor() {
    this.connectionManager = new ConnectionManager();
  }

  async validate(server) {
    try {
      if (!this.validateConfig(server)) {
        return ValidationResult.failure(['Invalid server configuration']);
      }

      const connectionTest = await this.connectionManager.testConnection(server);
      if (!connectionTest.success) {
        return ValidationResult.failure([connectionTest.error]);
      }

      return ValidationResult.success({
        responseTime: connectionTest.responseTime,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      logger.error('Server validation error:', error);
      return ValidationResult.failure(['Validation failed']);
    }
  }

  async checkHealth(serverId) {
    try {
      const result = await this.connectionManager.testConnection(serverId);
      return {
        isHealthy: result.success,
        lastCheck: new Date().toISOString(),
        responseTime: result.responseTime,
        error: result.error
      };
    } catch (error) {
      logger.error('Health check error:', error);
      return {
        isHealthy: false,
        lastCheck: new Date().toISOString(),
        error: error.message
      };
    }
  }

  private validateConfig(server) {
    return (
      server &&
      typeof server.host === 'string' &&
      typeof server.port === 'number' &&
      server.port > 0 &&
      server.port <= 65535 &&
      (!server.auth || (
        typeof server.auth.user === 'string' &&
        typeof server.auth.pass === 'string'
      ))
    );
  }
}