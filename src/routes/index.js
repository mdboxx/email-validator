import { fileHandler } from '../utils/fileHandler.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';
import { setupValidationRoutes } from './validation.js';
import { setupImportExportRoutes } from './importExport.js';
import { setupSmtpRoutes } from './smtp.js';
import { createPath } from '../utils/pathUtils.js';

export function setupRoutes(app) {
  // Setup validation routes
  setupValidationRoutes(app);
  
  // Setup import/export routes
  setupImportExportRoutes(app);

  // Setup SMTP routes
  setupSmtpRoutes(app);

  app.get('/health', (req, res) => {
    res.json({ status: 'ok', environment: config.env });
  });

  app.post('/upload', async (req, res) => {
    try {
      const { filename, content } = req.body;
      const filePath = createPath(config.uploadDir, filename);
      await fileHandler.writeFile(filePath, content);
      res.json({ success: true, path: filePath });
    } catch (error) {
      logger.error('Upload error:', error);
      res.status(500).json({ error: 'Upload failed' });
    }
  });
}