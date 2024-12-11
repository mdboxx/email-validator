import { expect, test, describe, beforeEach } from 'vitest';
import { ValidationMetrics } from '../../services/metrics/validationMetrics.js';

describe('ValidationMetrics', () => {
  let metrics;

  beforeEach(() => {
    metrics = new ValidationMetrics();
  });

  test('records successful validation', () => {
    const result = {
      success: true,
      details: {
        syntax: { errors: [] },
        domain: { errors: [] },
        mx: { valid: true },
        smtp: { valid: true }
      }
    };

    metrics.recordValidation(result, 100);
    const currentMetrics = metrics.getMetrics();

    expect(currentMetrics.totalValidations).toBe(1);
    expect(currentMetrics.successfulValidations).toBe(1);
    expect(currentMetrics.failedValidations).toBe(0);
    expect(currentMetrics.averageResponseTime).toBe(100);
  });

  test('records failed validation with error categorization', () => {
    const result = {
      success: false,
      details: {
        syntax: { errors: ['Invalid format'] },
        domain: { errors: [] },
        mx: { valid: false },
        smtp: { valid: false }
      }
    };

    metrics.recordValidation(result, 150);
    const currentMetrics = metrics.getMetrics();

    expect(currentMetrics.failedValidations).toBe(1);
    expect(currentMetrics.syntaxErrors).toBe(1);
    expect(currentMetrics.mxErrors).toBe(1);
    expect(currentMetrics.smtpErrors).toBe(1);
  });

  test('calculates success rate correctly', () => {
    const successResult = { success: true, details: {} };
    const failResult = { success: false, details: {} };

    metrics.recordValidation(successResult, 100);
    metrics.recordValidation(successResult, 100);
    metrics.recordValidation(failResult, 100);

    const currentMetrics = metrics.getMetrics();
    expect(currentMetrics.successRate).toBe(66.66666666666666);
  });
});