import { parse } from 'papaparse';
import { validateEmail } from './validation/emailValidator';

export async function parseEmailFile(file) {
  try {
    const fileType = file.name.split('.').pop().toLowerCase();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const emails = parseContent(content, fileType);
          resolve(emails.filter(validateEmail));
        } catch (error) {
          reject(new Error('Failed to parse file'));
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  } catch (error) {
    console.error('File parsing error:', error);
    throw error;
  }
}

function parseContent(content, fileType) {
  switch (fileType) {
    case 'csv':
      return parseCsvContent(content);
    case 'txt':
      return parseTextContent(content);
    default:
      throw new Error('Unsupported file type');
  }
}

function parseCsvContent(content) {
  const results = parse(content, {
    skipEmptyLines: true,
    transform: value => value.trim()
  });
  return results.data.flat();
}

function parseTextContent(content) {
  return content
    .split(/[\n,;]/)
    .map(line => line.trim())
    .filter(line => line.length > 0);
}