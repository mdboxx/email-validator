import { expect, test, describe, vi } from 'vitest';
import { MxValidator } from '../../services/emailValidation/mxValidator.js';
import dns from 'dns';

vi.mock('dns', () => ({
  resolveMx: vi.fn()
}));

describe('MxValidator', () => {
  test('validates domain with MX records', async () => {
    dns.resolveMx.mockImplementation((domain, callback) => {
      callback(null, [
        { exchange: 'mx1.example.com', priority: 10 },
        { exchange: 'mx2.example.com', priority: 20 }
      ]);
    });

    const result = await MxValidator.checkRecords('example.com');
    expect(result.isValid).toBe(true);
    expect(result.records).toHaveLength(2);
  });

  test('invalidates domain without MX records', async () => {
    dns.resolveMx.mockImplementation((domain, callback) => {
      callback(null, []);
    });

    const result = await MxValidator.checkRecords('invalid.com');
    expect(result.isValid).toBe(false);
    expect(result.records).toHaveLength(0);
  });

  test('handles DNS errors gracefully', async () => {
    dns.resolveMx.mockImplementation((domain, callback) => {
      callback(new Error('DNS query failed'));
    });

    const result = await MxValidator.checkRecords('error.com');
    expect(result.isValid).toBe(false);
    expect(result.records).toHaveLength(0);
  });
});