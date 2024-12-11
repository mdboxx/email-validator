import { parse as csvParse } from 'csv-parse/sync';
import { logger } from '../../../utils/logger.js';

export class CsvParser {
  static parse(content) {
    try {
      const records = csvParse(content, {
        columns: true,
        skip_empty_lines: true,
        trim: true
      });

      return records
        .filter(row => row.email)
        .map(row => row.email.trim());
    } catch (error) {
      logger.error('CSV parsing error:', error);
      throw error;
    }
  }
}