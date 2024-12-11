import { stringify } from 'csv-stringify/sync';
import { logger } from '../../../utils/logger.js';

export class CsvFormatter {
  static format(data, options = {}) {
    try {
      const columns = CsvFormatter.getColumns(options);
      
      return stringify(data, {
        header: true,
        columns,
        ...options
      });
    } catch (error) {
      logger.error('CSV formatting error:', error);
      throw error;
    }
  }

  static getColumns(options) {
    const defaultColumns = [
      'email',
      'isValid',
      'errors',
      'syntaxValid',
      'domainValid',
      'mxValid',
      'smtpValid',
      'disposable',
      'validationTime',
      'timestamp'
    ];

    return [...defaultColumns, ...(options.includeFields || [])];
  }
}