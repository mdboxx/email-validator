import { logger } from '../../utils/logger.js';
import { fileHandler } from '../../utils/fileHandler.js';
import { CsvParser } from './parsers/csvParser.js';
import { TextParser } from './parsers/textParser.js';
import { FormatDetector } from './formatDetector.js';

export class ImportService {
  async importFromFile(filePath, options = {}) {
    try {
      const fileContent = await fileHandler.readFile(filePath);
      return this.parseEmails(fileContent, options);
    } catch (error) {
      logger.error('File import error:', error);
      throw error;
    }
  }

  async importFromText(text, options = {}) {
    try {
      return this.parseEmails(text, options);
    } catch (error) {
      logger.error('Text import error:', error);
      throw error;
    }
  }

  async parseEmails(content, options = {}) {
    const format = options.format || FormatDetector.detect(content);

    switch (format) {
      case 'csv':
        return CsvParser.parse(content, options);
      case 'text':
        return TextParser.parse(content);
      default:
        throw new Error('Unsupported file format');
    }
  }
}