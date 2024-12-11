import nodemailer from 'nodemailer';
import { ConnectionTimeout } from './connectionTimeout.js';
import { ConnectionError } from './connectionError.js';
import { logger } from '../../../utils/logger.js';

export class ConnectionManager {
  static createTransport(config) {
    const timeouts = ConnectionTimeout.getTimeouts();
    return nodemailer.createTransport({
      ...config,
      ...timeouts
    });
  }

  async verifyEmail(server, email) {
    try {
      const transport = ConnectionManager.createTransport(server);
      const startTime = Date.now();
      const info = await transport.validateRecipient(email);
      const responseTime = Date.now() - startTime;

      return {
        isValid: true,
        details: info,
        responseTime,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Email verification failed:', error);
      return {
        isValid: false,
        error: ConnectionError.format(error),
        timestamp: new Date().toISOString()
      };
    }
  }

  static async testConnection(server) {
    try {
      const transport = this.createTransport(server);
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
        error: ConnectionError.format(error),
        timestamp: new Date().toISOString()
      };
    }
  }
}