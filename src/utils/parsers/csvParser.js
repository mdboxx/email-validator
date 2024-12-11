import { parse } from 'csv-parse/browser/esm/sync';
import { validateEmail } from '../validation/emailValidator';
import { logger } from '../logger';

export async function parseCsvFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const records = parse(content, {
          skip_empty_lines: true,
          trim: true
        });

        const emails = records
          .flat()
          .filter(cell => cell && typeof cell === 'string')
          .filter(validateEmail);

        resolve(emails);
      } catch (error) {
        logger.error('CSV parsing error:', error);
        reject(new Error('Failed to parse CSV file'));
      }
    };

    reader.onerror = () => {
      logger.error('File reading error');
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}