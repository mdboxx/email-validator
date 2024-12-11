import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Email validation endpoint
app.post('/api/validate/email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = emailRegex.test(email);

    if (!isValidFormat) {
      return res.json({
        isValid: false,
        errors: ['Invalid email format']
      });
    }

    // Extract domain for MX check
    const domain = email.split('@')[1];

    res.json({
      isValid: true,
      details: {
        syntax: { valid: true },
        domain: { valid: true, domain },
        email
      }
    });
  } catch (error) {
    console.error('Email validation error:', error);
    res.status(500).json({ error: 'Validation failed' });
  }
});

// SMTP test endpoint
app.post('/api/smtp/test', async (req, res) => {
  try {
    const { host, port, secure, auth } = req.body;

    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port, 10),
      secure: !!secure,
      auth,
      tls: {
        rejectUnauthorized: false // Allow self-signed certificates for testing
      },
      debug: true, // Enable debug logs
      logger: true // Enable logger
    });

    const result = await transporter.verify();
    res.json({ success: true });
  } catch (error) {
    console.error('SMTP test error:', error);
    res.status(500).json({ error: error.message || 'SMTP connection test failed' });
  }
});

// Save SMTP server endpoint
app.post('/api/smtp/server', async (req, res) => {
  try {
    const { host, port, secure, auth } = req.body;

    // Validate required fields
    if (!host || !port) {
      return res.status(400).json({ error: 'Host and port are required' });
    }

    // Test connection before saving
    const transporter = nodemailer.createTransport({
      host,
      port: parseInt(port, 10),
      secure: !!secure,
      auth,
      tls: {
        rejectUnauthorized: false
      }
    });

    await transporter.verify();

    // If verification succeeds, send success response
    res.json({ 
      success: true,
      server: {
        host,
        port: parseInt(port, 10),
        secure: !!secure,
        auth
      }
    });
  } catch (error) {
    console.error('SMTP server save error:', error);
    res.status(500).json({ error: error.message || 'Failed to save SMTP server' });
  }
});

// Bulk validation endpoint
app.post('/api/validate/bulk', async (req, res) => {
  try {
    const { emails } = req.body;
    if (!emails || !Array.isArray(emails)) {
      return res.status(400).json({ error: 'Emails array is required' });
    }

    const results = emails.map(email => {
      const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      return {
        email,
        isValid: isValidFormat,
        details: {
          syntax: { valid: isValidFormat },
          domain: { valid: isValidFormat, domain: email.split('@')[1] }
        }
      };
    });

    res.json({
      total: emails.length,
      valid: results.filter(r => r.isValid).length,
      results
    });
  } catch (error) {
    console.error('Bulk validation error:', error);
    res.status(500).json({ error: 'Bulk validation failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});