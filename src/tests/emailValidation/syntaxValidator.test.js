import { expect, test, describe } from 'vitest';
import { SyntaxValidator } from '../../services/emailValidation/syntaxValidator.js';

describe('SyntaxValidator', () => {
  test('validates correct email syntax', () => {
    const result = SyntaxValidator.validate('test@example.com');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('invalidates incorrect email syntax', () => {
    const result = SyntaxValidator.validate('invalid-email');
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0]).toBe('Invalid email format');
  });

  test('invalidates email without TLD', () => {
    const result = SyntaxValidator.validate('test@localhost');
    expect(result.isValid).toBe(false);
    expect(result.errors).toHaveLength(1);
  });
});