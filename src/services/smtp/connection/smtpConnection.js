import { SMTPConnection } from 'smtp-connection';
import { logger } from '../../../utils/logger.js';

export class SmtpConnection {
  constructor(config) {
    this.config = {
      ...config,
      port: parseInt(config.port, 10),
      timeout: config.timeout || 5000,
      logger: true,
      debug: true,
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates for testing
      }
    };
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = new SMTPConnection({
        ...this.config,
        connectionTimeout: this.config.timeout,
        socketTimeout: this.config.timeout
      });

      return new Promise((resolve, reject) => {
        this.connection.connect((err) => {
          if (err) {
            logger.error('SMTP connection error:', err);
            reject(err);
            return;
          }
          resolve(true);
        });
      });
    } catch (error) {
      logger.error('SMTP connection creation error:', error);
      throw error;
    }
  }

  async verifyEmail(email) {
    if (!this.connection) {
      throw new Error('Not connected to SMTP server');
    }

    try {
      const result = await this.executeEmailVerification(email);
      return {
        isValid: result.success,
        details: {
          response: result.response,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      logger.error('Email verification error:', error);
      return {
        isValid: false,
        details: {
          error: error.message,
          timestamp: new Date().toISOString()
        }
      };
    }
  }

  private async executeEmailVerification(email) {
    return new Promise((resolve, reject) => {
      // Use a test sender address
      const sender = 'validator@email-validator.local';

      this.connection.send({
        from: sender,
        to: email
      }, (err, info) => {
        if (err) {
          // Check for specific SMTP error codes
          if (err.responseCode >= 500) {
            resolve({ success: false, response: err.response });
          } else {
            reject(err);
          }
        } else {
          resolve({ success: true, response: info.response });
        }
      });
    });
  }

  async testConnection() {
    try {
      const startTime = Date.now();
      await this.connect();
      const endTime = Date.now();

      return {
        success: true,
        responseTime: endTime - startTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    } finally {
      this.disconnect();
    }
  }

  disconnect() {
    if (this.connection) {
      try {
        this.connection.quit();
      } catch (error) {
        logger.error('Error disconnecting:', error);
      }
      this.connection = null;
    }
  }
}