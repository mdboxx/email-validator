import { expect, test, describe, beforeEach } from 'vitest';
import { RateLimiterService } from '../../services/rateLimiter/index.js';

describe('RateLimiterService', () => {
  let rateLimiter;

  beforeEach(() => {
    rateLimiter = new RateLimiterService({
      points: 2,
      duration: 1
    });
  });

  test('allows requests within limit', async () => {
    const result1 = await rateLimiter.tryConsume('test@example.com');
    const result2 = await rateLimiter.tryConsume('test@example.com');
    
    expect(result1).toBe(true);
    expect(result2).toBe(true);
  });

  test('blocks requests over limit', async () => {
    await rateLimiter.tryConsume('test@example.com');
    await rateLimiter.tryConsume('test@example.com');
    const result = await rateLimiter.tryConsume('test@example.com');
    
    expect(result).toBe(false);
  });

  test('tracks remaining points correctly', async () => {
    const initial = await rateLimiter.getRemainingPoints('test@example.com');
    await rateLimiter.tryConsume('test@example.com');
    const after = await rateLimiter.getRemainingPoints('test@example.com');
    
    expect(initial).toBe(2);
    expect(after).toBe(1);
  });
});