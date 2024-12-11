import { expect, test, describe, vi } from 'vitest';
import { SmtpConnectionManager } from '../../services/smtp/connectionManager.js';
import nodemailer from 'nodemailer';

vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn()
  }
}));

describe('SmtpConnectionManager', () => {
  const mockServer = {
    host: 'smtp.example.com',
    port: 587,
    secure: false,
    auth: {
      user: 'test@example.com',
      pass: 'password'
    }
  };

  test('creates SMTP connection with correct config', () => {
    SmtpConnectionManager.createConnection(mockServer);
    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      ...mockServer,
      connectionTimeout: 5000,
      greetingTimeout: 5000,
      socketTimeout: 5000
    });
  });

  test('tests connection successfully', async () => {
    const mockTransport = {
      verify: vi.fn().mockResolvedValue(true)
    };
    nodemailer.createTransport.mockReturnValue(mockTransport);

    const result = await SmtpConnectionManager.testConnection(mockServer);
    expect(result).toBe(true);
  });

  test('verifies recipient successfully', async () => {
    const mockTransport = {
      validateRecipient: vi.fn().mockResolvedValue({ response: 'OK' })
    };

    const result = await SmtpConnectionManager.verifyRecipient(
      mockTransport,
      'test@example.com'
    );
    expect(result.isValid).toBe(true);
  });
});