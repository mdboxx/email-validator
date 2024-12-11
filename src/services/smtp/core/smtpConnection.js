import nodemailer from 'nodemailer';
import { logger } from '../../../utils/logger.js';

export class SmtpConnection {
  constructor(config) {
    this.config = config;
    this.transport = null;
  }

  async connect() {
    try {
      this.transport = nodemailer.createTransport(this.config);
      await this.transport.verify();
      return true;
    } catch (error) {
      logger.error('SMTP connection error:', error);
      return false;
    }
  }

  async verifyEmail(email) {
    try {
      if (!this.transport) {
        throw new Error('SMTP transport not initialized');
      }

      const result = await this.transport.validateRecipient(email);
      return {
        isValid: true,
        details: result
      };
    } catch (error) {
      logger.error('Email verification error:', error);
      return {
        isValid: false,
        error: error.message
      };
    }
  }

  disconnect() {
    if (this.transport) {
      this.transport.close();
      this.transport = null;
    }
  }
}