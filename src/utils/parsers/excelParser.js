import * as XLSX from 'xlsx';
import { validateEmail } from '../validation/emailValidator';
import { logger } from '../logger';

export async function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        
        const emails = rows
          .flat()
          .filter(cell => cell && typeof cell === 'string')
          .filter(validateEmail);

        resolve(emails);
      } catch (error) {
        logger.error('Excel parsing error:', error);
        reject(new Error('Failed to parse Excel file'));
      }
    };

    reader.onerror = () => {
      logger.error('File reading error');
      reject(new Error('Failed to read file'));
    };

    reader.readAsArrayBuffer(file);
  });
}