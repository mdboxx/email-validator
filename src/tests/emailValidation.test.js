import { expect, test, describe } from 'vitest';
import { EmailValidator } from '../services/emailValidation/validator.js';

describe('EmailValidator', () => {
  test('validates correct email syntax', () => {
    const result = EmailValidator.validateSyntax('test@example.com');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('invalidates incorrect email syntax', () => {
    const result = EmailValidator.validateSyntax('invalid-email');
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
  });

  test('validates correct domain format', () => {
    const result = EmailValidator.validateDomain('test@example.com');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('invalidates incorrect domain format', () => {
    const result = EmailValidator.validateDomain('test@invalid');
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
  });
});