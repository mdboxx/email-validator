import { expect, test, describe } from 'vitest';
import { DomainValidator } from '../../services/emailValidation/domainValidator.js';

describe('DomainValidator', () => {
  test('validates correct domain format', () => {
    const result = DomainValidator.validate('test@example.com');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.domain).toBe('example.com');
  });

  test('invalidates incorrect domain format', () => {
    const result = DomainValidator.validate('test@invalid');
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toBe('Invalid domain format');
  });

  test('handles invalid email format gracefully', () => {
    const result = DomainValidator.validate('invalid-email');
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.domain).toBe(undefined);
  });
});