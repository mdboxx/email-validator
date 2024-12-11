import express from 'express';
import cors from 'cors';
import { EmailValidationService } from './services/emailValidation/service.js';
import { SmtpVerifier } from './services/smtp/smtpVerifier.js';
import { logger } from './utils/logger.js';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const emailValidator = new EmailValidationService();
const smtpVerifier = new SmtpVerifier();

// Email validation endpoint
app.post('/api/validate/email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    logger.info('Starting email validation:', email);
    const result = await emailValidator.validateEmail(email);
    res.json(result);
  } catch (error) {
    logger.error('Email validation error:', error);
    res.status(500).json({ error: error.message || 'Failed to validate email' });
  }
});

// Bulk validation endpoint
app.post('/api/validate/bulk', async (req, res) => {
  try {
    const { emails } = req.body;
    if (!emails || !Array.isArray(emails)) {
      return res.status(400).json({ error: 'Emails array is required' });
    }

    const results = await Promise.all(
      emails.map(email => emailValidator.validateEmail(email))
    );

    res.json({
      total: emails.length,
      valid: results.filter(r => r.isValid).length,
      results
    });
  } catch (error) {
    logger.error('Bulk validation error:', error);
    res.status(500).json({ error: error.message || 'Failed to validate emails' });
  }
});

// SMTP server management endpoints
app.post('/api/smtp/server', async (req, res) => {
  try {
    const serverConfig = req.body;
    const serverId = await smtpVerifier.addServer(serverConfig);
    res.json({ success: true, serverId });
  } catch (error) {
    logger.error('Failed to add SMTP server:', error);
    res.status(500).json({ error: error.message || 'Failed to save SMTP server' });
  }
});

app.post('/api/smtp/test', async (req, res) => {
  try {
    const serverConfig = req.body;
    logger.info('Testing SMTP connection:', serverConfig);
    const result = await smtpVerifier.testConnection(serverConfig);
    res.json(result);
  } catch (error) {
    logger.error('SMTP test error:', error);
    res.status(500).json({ error: error.message || 'Failed to test SMTP connection' });
  }
});

app.get('/api/smtp/servers', async (req, res) => {
  try {
    const servers = smtpVerifier.getAllServerStatuses();
    res.json(servers);
  } catch (error) {
    logger.error('Error getting SMTP servers:', error);
    res.status(500).json({ error: 'Failed to get SMTP servers' });
  }
});

app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});