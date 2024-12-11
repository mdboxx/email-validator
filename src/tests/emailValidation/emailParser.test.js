import { expect, test, describe } from 'vitest';
import { EmailParser } from '../../services/emailValidation/emailParser.js';

describe('EmailParser', () => {
  test('parses valid email address', () => {
    const result = EmailParser.parse('test@example.com');
    expect(result.success).toBe(true);
    expect(result.localPart).toBe('test');
    expect(result.domain).toBe('example.com');
  });

  test('handles invalid email format', () => {
    const result = EmailParser.parse('invalid-email');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Invalid email format');
  });

  test('extracts domain correctly', () => {
    const domain = EmailParser.extractDomain('test@example.com');
    expect(domain).toBe('example.com');
  });

  test('extracts local part correctly', () => {
    const localPart = EmailParser.extractLocalPart('test@example.com');
    expect(localPart).toBe('test');
  });
});