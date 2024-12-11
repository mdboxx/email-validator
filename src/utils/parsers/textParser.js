import { validateEmail } from '../validation/emailValidator';
import { logger } from '../logger';

export async function parseTextFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const emails = content
          .split(/[\n,;]/)
          .map(line => line.trim())
          .filter(line => line.length > 0)
          .filter(validateEmail);

        resolve(emails);
      } catch (error) {
        logger.error('Text parsing error:', error);
        reject(new Error('Failed to parse text file'));
      }
    };

    reader.onerror = () => {
      logger.error('File reading error');
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}