import { fileHandler } from '../../utils/fileHandler.js';
import { logger } from '../../utils/logger.js';
import { ResultFormatter } from './formatters/resultFormatter.js';
import { CsvFormatter } from './formatters/csvFormatter.js';

export class ExportService {
  async exportToCsv(results, outputPath, options = {}) {
    try {
      const formattedResults = ResultFormatter.format(results, options);
      const csvContent = await CsvFormatter.format(formattedResults, options);
      await fileHandler.writeFile(outputPath, csvContent);
      return outputPath;
    } catch (error) {
      logger.error('CSV export error:', error);
      throw error;
    }
  }
}