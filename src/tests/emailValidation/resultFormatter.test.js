import { expect, test, describe } from 'vitest';
import { ValidationResultFormatter } from '../../services/emailValidation/resultFormatter.js';

describe('ValidationResultFormatter', () => {
  test('formats successful validation result', () => {
    const result = {
      isValid: true,
      errors: [],
      details: {
        syntax: { isValid: true, errors: [] },
        domain: { isValid: true, domain: 'example.com', errors: [] },
        mx: { isValid: true, records: [{ exchange: 'mx.example.com', priority: 10 }] },
        smtp: { isValid: true, smtp: { response: 'OK' } }
      }
    };

    const formatted = ValidationResultFormatter.format(result, {
      email: 'test@example.com',
      rateLimit: { remaining: 9 }
    });

    expect(formatted.success).toBe(true);
    expect(formatted.email).toBe('test@example.com');
    expect(formatted.details.domain.value).toBe('example.com');
    expect(formatted.rateLimit.remaining).toBe(9);
  });

  test('formats validation error result', () => {
    const result = {
      isValid: false,
      errors: ['Invalid email format'],
      details: {
        syntax: { isValid: false, errors: ['Invalid format'] }
      }
    };

    const formatted = ValidationResultFormatter.format(result, {
      email: 'invalid-email'
    });

    expect(formatted.success).toBe(false);
    expect(formatted.errors).toContain('Invalid email format');
    expect(formatted.details.syntax.valid).toBe(false);
  });
});