import { expect, test, describe, beforeEach, vi } from 'vitest';
import { ValidationCache } from '../../services/cache/validationCache.js';

describe('ValidationCache', () => {
  let cache;
  const mockResult = { success: true, email: 'test@example.com' };

  beforeEach(() => {
    vi.useFakeTimers();
    cache = new ValidationCache({ ttl: 1000, maxSize: 3 });
  });

  test('stores and retrieves cache entries', () => {
    cache.set('test@example.com', mockResult);
    const result = cache.get('test@example.com');
    expect(result).toEqual(mockResult);
  });

  test('expires cache entries after TTL', () => {
    cache.set('test@example.com', mockResult);
    vi.advanceTimersByTime(1001);
    const result = cache.get('test@example.com');
    expect(result).toBeNull();
  });

  test('evicts oldest entries when cache is full', () => {
    cache.set('one@example.com', mockResult);
    cache.set('two@example.com', mockResult);
    cache.set('three@example.com', mockResult);
    cache.set('four@example.com', mockResult);

    expect(cache.get('one@example.com')).toBeNull();
    expect(cache.get('four@example.com')).toEqual(mockResult);
  });

  test('clears expired entries', () => {
    cache.set('test1@example.com', mockResult);
    vi.advanceTimersByTime(500);
    cache.set('test2@example.com', mockResult);
    vi.advanceTimersByTime(501);
    
    cache.clearExpired();
    
    expect(cache.get('test1@example.com')).toBeNull();
    expect(cache.get('test2@example.com')).not.toBeNull();
  });
});