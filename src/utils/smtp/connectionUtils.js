import { logger } from '../logger.js';

export class ConnectionUtils {
  static readonly DEFAULT_TIMEOUTS = {
    connection: 5000,
    greeting: 5000,
    socket: 5000
  };

  static createConnectionConfig(server, timeouts = {}) {
    return {
      host: server.host,
      port: server.port,
      secure: server.secure,
      auth: server.auth,
      connectionTimeout: timeouts.connection || this.DEFAULT_TIMEOUTS.connection,
      greetingTimeout: timeouts.greeting || this.DEFAULT_TIMEOUTS.greeting,
      socketTimeout: timeouts.socket || this.DEFAULT_TIMEOUTS.socket
    };
  }

  static async testConnection(transport) {
    try {
      const startTime = Date.now();
      const result = await transport.verify();
      const responseTime = Date.now() - startTime;

      return {
        success: result,
        responseTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Connection test failed:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  static formatConnectionError(error) {
    return {
      message: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      timestamp: new Date().toISOString()
    };
  }
}