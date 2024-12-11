import { expect, test, describe, beforeEach } from 'vitest';
import { ServerRotation } from '../../services/smtp/serverRotation.js';

describe('ServerRotation', () => {
  let rotation;

  beforeEach(() => {
    rotation = new ServerRotation();
  });

  test('returns -1 for zero servers', () => {
    expect(rotation.getNextIndex(0)).toBe(-1);
  });

  test('rotates through server indices correctly', () => {
    expect(rotation.getNextIndex(3)).toBe(0);
    expect(rotation.getNextIndex(3)).toBe(1);
    expect(rotation.getNextIndex(3)).toBe(2);
    expect(rotation.getNextIndex(3)).toBe(0);
  });
});