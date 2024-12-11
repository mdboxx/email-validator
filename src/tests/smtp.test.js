import { expect, test, describe, beforeEach } from 'vitest';
import { SmtpConfigManager } from '../services/smtp/smtpConfig.js';

describe('SmtpConfigManager', () => {
  let configManager;

  beforeEach(() => {
    configManager = new SmtpConfigManager();
  });

  test('adds valid SMTP server configuration', () => {
    const config = {
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: {
        user: 'user@example.com',
        pass: 'password'
      }
    };

    expect(() => configManager.addServer(config)).not.toThrow();
  });

  test('rejects invalid SMTP server configuration', () => {
    const invalidConfig = {
      host: 'smtp.example.com'
      // Missing required fields
    };

    expect(() => configManager.addServer(invalidConfig)).toThrow();
  });

  test('rotates through available servers', () => {
    const config1 = {
      host: 'smtp1.example.com',
      port: 587,
      secure: false,
      auth: {
        user: 'user1@example.com',
        pass: 'password1'
      }
    };

    const config2 = {
      host: 'smtp2.example.com',
      port: 587,
      secure: false,
      auth: {
        user: 'user2@example.com',
        pass: 'password2'
      }
    };

    configManager.addServer(config1);
    configManager.addServer(config2);

    const server1 = configManager.getNextServer();
    const server2 = configManager.getNextServer();
    const server3 = configManager.getNextServer();

    expect(server1.host).toBe('smtp1.example.com');
    expect(server2.host).toBe('smtp2.example.com');
    expect(server3.host).toBe('smtp1.example.com');
  });
});