import { expect, test, describe, beforeAll } from 'vitest';
import { EmailValidationService } from '../../services/emailValidation/service.js';
import { config } from '../../config/index.js';

describe('Email Validation Integration Tests', () => {
  let validator;

  beforeAll(() => {
    validator = new EmailValidationService();
  });

  test('validates correct email address', async () => {
    const result = await validator.validateEmail('test@example.com');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('detects disposable email address', async () => {
    const result = await validator.validateEmail('test@tempmail.com');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Disposable email domain detected');
  });

  test('validates MX records', async () => {
    const result = await validator.validateEmail('test@gmail.com');
    expect(result.isValid).toBe(true);
    expect(result.details.mx.records).toBeDefined();
    expect(result.details.mx.records.length).toBeGreaterThan(0);
  });

  test('handles rate limiting', async () => {
    const emails = Array(config.rateLimiting.points + 1)
      .fill('test@example.com');
    
    const results = await Promise.all(
      emails.map(email => validator.validateEmail(email))
    );

    const rateLimited = results.some(result => 
      result.errors.includes('Rate limit exceeded')
    );
    expect(rateLimited).toBe(true);
  });
});