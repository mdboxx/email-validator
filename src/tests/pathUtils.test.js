import { expect, test } from 'vitest';
import { getPlatformPath, createPath } from '../utils/pathUtils.js';
import { sep } from 'path';

test('converts paths to platform-specific format', () => {
  const unixPath = 'path/to/file';
  const platformPath = getPlatformPath(unixPath);
  expect(platformPath).toBe(['path', 'to', 'file'].join(sep));
});

test('creates platform-independent path', () => {
  const path = createPath('dir', 'subdir', 'file.txt');
  expect(path).toBe(['dir', 'subdir', 'file.txt'].join(sep));
});