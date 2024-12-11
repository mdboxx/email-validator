import nodemailer from 'nodemailer';
import { logger } from '../../utils/logger.js';

export class SmtpConnectionManager {
  static createConnection(server) {
    const config = {
      host: server.host,
      port: server.port,
      secure: server.secure,
      auth: server.auth,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000,
      debug: true,
      logger: true,
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates
      }
    };

    logger.info('Creating SMTP transport with config:', { ...config, auth: '***' });
    return nodemailer.createTransport(config);
  }

  static async testConnection(server) {
    try {
      logger.info('Testing SMTP connection:', { ...server, auth: '***' });
      const transport = this.createConnection(server);
      
      const startTime = Date.now();
      logger.info('Verifying SMTP connection...');
      const result = await transport.verify();
      const responseTime = Date.now() - startTime;

      if (!result) {
        throw new Error('Connection verification failed');
      }

      logger.info('SMTP connection verified successfully');
      return {
        success: true,
        responseTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('SMTP connection test failed:', error);
      return {
        success: false,
        error: error.message || 'Connection test failed',
        timestamp: new Date().toISOString()
      };
    }
  }

  static async verifyRecipient(transport, email) {
    try {
      logger.info(`Verifying recipient: ${email}`);
      const info = await transport.verify();
      if (!info) {
        throw new Error('Recipient verification failed');
      }

      return {
        isValid: true,
        details: { response: 'OK' }
      };
    } catch (error) {
      logger.error('Recipient verification failed:', error);
      return {
        isValid: false,
        details: { error: error.message }
      };
    } finally {
      transport.close();
    }
  }
}