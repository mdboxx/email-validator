import { SmtpVerifier } from '../services/smtp/smtpVerifier.js';
import { logger } from '../utils/logger.js';
import { createPath } from '../utils/pathUtils.js';
import { config } from '../config/index.js';
import { fileHandler } from '../utils/fileHandler.js';

export function setupSmtpRoutes(app) {
  app.post('/api/smtp/import/file', async (req, res) => {
    try {
      if (!req.files || !req.files.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const file = req.files.file;
      const filePath = createPath(config.uploadDir, file.name);
      await fileHandler.writeFile(filePath, file.data);

      const results = await importService.importFromFile(filePath);
      
      // Add valid servers to the SMTP verifier pool
      results.servers
        .filter(server => server.valid)
        .forEach(server => smtpVerifier.addServer(server));

      res.json(results);
    } catch (error) {
      logger.error('SMTP server file import error:', error);
      res.status(500).json({ error: 'Import failed' });
    }
  });

  app.post('/api/smtp/import/text', async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'No text provided' });
      }

      const results = await importService.importFromText(text);
      
      // Add valid servers to the SMTP verifier pool
      results.servers
        .filter(server => server.valid)
        .forEach(server => smtpVerifier.addServer(server));

      res.json(results);
    } catch (error) {
      logger.error('SMTP server text import error:', error);
      res.status(500).json({ error: 'Import failed' });
    }
  });

  app.get('/api/smtp/servers', (req, res) => {
    try {
      const statuses = smtpVerifier.getAllServerStatuses();
      res.json(statuses);
    } catch (error) {
      logger.error('Error getting SMTP server statuses:', error);
      res.status(500).json({ error: 'Failed to get server statuses' });
    }
  });
}