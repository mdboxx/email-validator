import { logger } from '../../../../utils/logger.js';

export class SmtpServerParser {
  parse(content) {
    try {
      // Try parsing as JSON first
      if (this.isJson(content)) {
        return this.parseJson(content);
      }

      // Fall back to parsing as plain text
      return this.parsePlainText(content);
    } catch (error) {
      logger.error('SMTP server parsing error:', error);
      throw error;
    }
  }

  private isJson(content) {
    try {
      JSON.parse(content);
      return true;
    } catch {
      return false;
    }
  }

  private parseJson(content) {
    const data = JSON.parse(content);
    return Array.isArray(data) ? data : [data];
  }

  private parsePlainText(content) {
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(line => {
        const [host, port, secure, user, pass] = line.split(',').map(s => s.trim());
        return {
          host,
          port: parseInt(port, 10) || 587,
          secure: secure === 'true',
          auth: user && pass ? { user, pass } : undefined
        };
      });
  }
}