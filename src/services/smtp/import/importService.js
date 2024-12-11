import { fileHandler } from '../../../utils/fileHandler.js';
import { logger } from '../../../utils/logger.js';
import { SmtpServerParser } from './parsers/smtpServerParser.js';
import { ConnectionManager } from '../connection/connectionManager.js';

export class SmtpImportService {
  constructor() {
    this.parser = new SmtpServerParser();
    this.connectionManager = new ConnectionManager();
  }

  async importFromFile(filePath) {
    try {
      const content = await fileHandler.readFile(filePath);
      return this.importFromText(content);
    } catch (error) {
      logger.error('SMTP server file import error:', error);
      throw error;
    }
  }

  async importFromText(text) {
    try {
      const servers = this.parser.parse(text);
      const results = await this.validateServers(servers);
      return {
        total: servers.length,
        valid: results.filter(r => r.valid).length,
        servers: results
      };
    } catch (error) {
      logger.error('SMTP server text import error:', error);
      throw error;
    }
  }

  private async validateServers(servers) {
    return Promise.all(
      servers.map(async server => {
        try {
          const testResult = await this.connectionManager.testConnection(server);
          return {
            ...server,
            valid: testResult.success,
            error: testResult.error,
            responseTime: testResult.responseTime
          };
        } catch (error) {
          return {
            ...server,
            valid: false,
            error: error.message
          };
        }
      })
    );
  }
}