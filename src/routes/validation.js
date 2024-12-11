/**
 * @swagger
 * /api/validate/email:
 *   post:
 *     summary: Validate email address
 *     description: Performs comprehensive email validation including syntax, domain, MX records, and SMTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email address to validate
 *     responses:
 *       200:
 *         description: Validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isValid:
 *                   type: boolean
 *                 details:
 *                   type: object
 */

import { EmailValidationService } from '../services/emailValidation/index.js';
import { logger } from '../utils/logger.js';

const emailValidator = new EmailValidationService();

export function setupValidationRoutes(app) {
  app.post('/api/smtp/server', (req, res) => {
    try {
      const serverConfig = req.body;
      emailValidator.addSmtpServer(serverConfig);
      res.json({ success: true, message: 'SMTP server added successfully' });
    } catch (error) {
      logger.error('Adding SMTP server error:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  app.post('/api/validate/email', async (req, res) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({
          isValid: false,
          errors: ['Email is required']
        });
      }

      const result = await emailValidator.validateEmail(email);
      res.json(result);
    } catch (error) {
      logger.error('Validation route error:', error);
      res.status(500).json({
        isValid: false,
        errors: ['Internal server error']
      });
    }
  });
}