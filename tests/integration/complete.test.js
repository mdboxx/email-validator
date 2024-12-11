import { expect, test, describe, beforeAll } from 'vitest';
import { EmailValidationService } from '../../services/emailValidation/service.js';
import { SmtpVerifier } from '../../services/smtp/smtpVerifier.js';
import { DisposableDomainsManager } from '../../services/emailValidation/disposable/disposableDomainsManager.js';

describe('Complete Email Validation Integration Tests', () => {
  let validator;
  let smtpVerifier;
  let disposableManager;

  beforeAll(async () => {
    validator = new EmailValidationService();
    smtpVerifier = new SmtpVerifier();
    disposableManager = new DisposableDomainsManager();
    await disposableManager.initialize();
  });

  test('validates legitimate email address', async () => {
    const result = await validator.validateEmail('test@gmail.com');
    expect(result.isValid).toBe(true);
    expect(result.details.syntax.valid).toBe(true);
    expect(result.details.domain.valid).toBe(true);
    expect(result.details.mx.records.length).toBeGreaterThan(0);
  });

  test('detects disposable email address', async () => {
    const result = await validator.validateEmail('test@tempmail.com');
    expect(result.isValid).toBe(false);
    expect(result.details.disposable.isDisposable).toBe(true);
  });

  test('detects role-based email address', async () => {
    const result = await validator.validateEmail('admin@example.com');
    expect(result.isValid).toBe(false);
    expect(result.details.role.isRoleBased).toBe(true);
  });

  test('handles invalid syntax', async () => {
    const result = await validator.validateEmail('invalid-email');
    expect(result.isValid).toBe(false);
    expect(result.details.syntax.valid).toBe(false);
  });

  test('handles non-existent domain', async () => {
    const result = await validator.validateEmail('test@nonexistent-domain-12345.com');
    expect(result.isValid).toBe(false);
    expect(result.details.domain.valid).toBe(false);
  });

  test('respects rate limiting', async () => {
    const emails = Array(11).fill('test@example.com');
    const results = await Promise.all(
      emails.map(email => validator.validateEmail(email))
    );
    const rateLimited = results.some(result => 
      result.errors?.includes('Rate limit exceeded')
    );
    expect(rateLimited).toBe(true);
  });

  test('utilizes caching', async () => {
    const email = 'cache-test@example.com';
    const firstResult = await validator.validateEmail(email);
    const startTime = Date.now();
    const secondResult = await validator.validateEmail(email);
    const duration = Date.now() - startTime;

    expect(secondResult.isValid).toBe(firstResult.isValid);
    expect(duration).toBeLessThan(100); // Cache response should be fast
  });

  test('handles bulk validation', async () => {
    const emails = [
      'test1@example.com',
      'test2@example.com',
      'invalid-email',
      'admin@example.com'
    ];

    const results = await validator.validateBulk(emails);
    expect(results.total).toBe(4);
    expect(results.valid).toBeLessThan(4);
    expect(Array.isArray(results.results)).toBe(true);
  });

  test('checks catch-all domains', async () => {
    const result = await validator.validateEmail('test@catch-all-domain.com');
    expect(result.details.catchAll).toBeDefined();
    expect(typeof result.details.catchAll.isCatchAll).toBe('boolean');
  });
});