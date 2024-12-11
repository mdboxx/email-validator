import { expect, test, describe } from 'vitest';
import { ServerValidator } from '../../services/smtp/serverValidator.js';

describe('ServerValidator', () => {
  test('validates correct server configuration', () => {
    const config = {
      host: 'smtp.example.com',
      port: 587,
      secure: false,
      auth: {
        user: 'user@example.com',
        pass: 'password'
      }
    };
    expect(ServerValidator.isValid(config)).toBe(true);
  });

  test('invalidates incorrect server configuration', () => {
    const config = {
      host: 'smtp.example.com'
    };
    expect(ServerValidator.isValid(config)).toBe(false);
  });

  test('checks server availability correctly', () => {
    const server = {
      failureCount: 0,
      lastFailure: null
    };
    expect(ServerValidator.isAvailable(server)).toBe(true);

    server.failureCount = 4;
    server.lastFailure = Date.now();
    expect(ServerValidator.isAvailable(server)).toBe(false);
  });
});