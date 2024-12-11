import { promises as fs } from 'fs';
import { dirname } from 'path';
import { logger } from './logger.js';
import { createPath } from './pathUtils.js';

export const fileHandler = {
  /**
   * Ensures a directory exists, creating it if necessary
   * @param {string} dirPath - The directory path
   */
  async ensureDir(dirPath) {
    try {
      await fs.access(dirPath);
    } catch {
      await fs.mkdir(dirPath, { recursive: true });
    }
  },

  /**
   * Writes data to a file, ensuring the directory exists
   * @param {string} filePath - The file path
   * @param {string|Buffer} data - The data to write
   */
  async writeFile(filePath, data) {
    const dir = dirname(filePath);
    await this.ensureDir(dir);
    await fs.writeFile(filePath, data);
  },

  /**
   * Appends data to a file, ensuring the directory exists
   * @param {string} filePath - The file path
   * @param {string|Buffer} data - The data to append
   */
  async appendToFile(filePath, data) {
    const dir = dirname(filePath);
    await this.ensureDir(dir);
    await fs.appendFile(filePath, data);
  },

  /**
   * Reads data from a file
   * @param {string} filePath - The file path
   * @returns {Promise<string|Buffer>} The file contents
   */
  async readFile(filePath) {
    try {
      return await fs.readFile(filePath, 'utf8');
    } catch (error) {
      logger.error(`Error reading file ${filePath}:`, error);
      throw error;
    }
  }
};