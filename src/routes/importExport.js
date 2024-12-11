import multer from 'multer';
import { ImportService } from '../services/import/importService.js';
import { ExportService } from '../services/export/exportService.js';
import { EmailValidationService } from '../services/emailValidation/service.js';
import { logger } from '../utils/logger.js';
import { createPath } from '../utils/pathUtils.js';
import { config } from '../config/index.js';

const upload = multer({ dest: createPath(config.uploadDir) });
const importService = new ImportService();
const exportService = new ExportService();
const validationService = new EmailValidationService();

export function setupImportExportRoutes(app) {
  app.post('/api/import/file', upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const emails = await importService.importFromFile(req.file.path, req.body);
      const results = await Promise.all(
        emails.map(email => validationService.validateEmail(email))
      );

      res.json({
        success: true,
        total: results.length,
        valid: results.filter(r => r.isValid).length,
        results
      });
    } catch (error) {
      logger.error('File import error:', error);
      res.status(500).json({ error: 'Import failed' });
    }
  });

  app.post('/api/import/text', async (req, res) => {
    try {
      const { text, options } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'No text provided' });
      }

      const emails = await importService.importFromText(text, options);
      const results = await Promise.all(
        emails.map(email => validationService.validateEmail(email))
      );

      res.json({
        success: true,
        total: results.length,
        valid: results.filter(r => r.isValid).length,
        results
      });
    } catch (error) {
      logger.error('Text import error:', error);
      res.status(500).json({ error: 'Import failed' });
    }
  });

  app.post('/api/export/csv', async (req, res) => {
    try {
      const { results, options } = req.body;
      if (!results || !Array.isArray(results)) {
        return res.status(400).json({ error: 'Invalid results data' });
      }

      const outputPath = createPath(
        config.uploadDir,
        `validation-results-${Date.now()}.csv`
      );

      await exportService.exportToCsv(results, outputPath, options);
      res.download(outputPath);
    } catch (error) {
      logger.error('CSV export error:', error);
      res.status(500).json({ error: 'Export failed' });
    }
  });
}