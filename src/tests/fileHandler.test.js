import { expect, test, beforeAll, afterAll } from 'vitest';
import { fileHandler } from '../utils/fileHandler.js';
import { createPath } from '../utils/pathUtils.js';
import { promises as fs } from 'fs';
import { join } from 'path';

const TEST_DIR = createPath('test-files');
const TEST_FILE = createPath(TEST_DIR, 'test.txt');
const TEST_CONTENT = 'Hello, World!';

beforeAll(async () => {
  await fileHandler.ensureDir(TEST_DIR);
});

afterAll(async () => {
  await fs.rm(TEST_DIR, { recursive: true, force: true });
});

test('writes and reads file correctly', async () => {
  await fileHandler.writeFile(TEST_FILE, TEST_CONTENT);
  const content = await fileHandler.readFile(TEST_FILE);
  expect(content).toBe(TEST_CONTENT);
});

test('ensures directory exists', async () => {
  const newDir = join(TEST_DIR, 'nested', 'dir');
  await fileHandler.ensureDir(newDir);
  const stats = await fs.stat(newDir);
  expect(stats.isDirectory()).toBe(true);
});