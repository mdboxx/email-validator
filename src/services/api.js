import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Mock SMTP validation results for development
const mockSmtpValidation = (email) => {
  const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const domain = email.split('@')[1];
  return commonDomains.includes(domain);
};

export async function validateEmail(email) {
  try {
    // In development, use mock validation
    if (import.meta.env.DEV) {
      const isValid = mockSmtpValidation(email);
      return {
        isValid,
        details: {
          syntax: { valid: true },
          domain: { valid: true, domain: email.split('@')[1] },
          smtp: { valid: isValid, response: isValid ? 'OK' : 'Invalid recipient' }
        }
      };
    }

    const response = await api.post('/validate/email', { email });
    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to validate email');
  }
}

export async function validateBulk(emails) {
  try {
    // In development, use mock validation
    if (import.meta.env.DEV) {
      const results = emails.map(email => ({
        email,
        isValid: mockSmtpValidation(email),
        details: {
          syntax: { valid: true },
          domain: { valid: true, domain: email.split('@')[1] }
        }
      }));

      return {
        total: emails.length,
        valid: results.filter(r => r.isValid).length,
        results
      };
    }

    const response = await api.post('/validate/bulk', { emails });
    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to validate emails');
  }
}

export async function testSmtpConnection(config) {
  try {
    // In development, simulate SMTP test
    if (import.meta.env.DEV) {
      const commonSmtpServers = [
        { host: 'smtp.gmail.com', port: '587' },
        { host: 'smtp.office365.com', port: '587' },
        { host: 'smtp.mail.yahoo.com', port: '587' }
      ];

      const isValid = commonSmtpServers.some(
        server => server.host === config.host && server.port === config.port
      );

      return {
        success: isValid,
        responseTime: 100,
        timestamp: new Date().toISOString()
      };
    }

    const response = await api.post('/smtp/test', {
      ...config,
      port: parseInt(config.port, 10)
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('SMTP connection test failed');
  }
}

export async function saveSmtpServer(config) {
  try {
    // In development, simulate saving SMTP server
    if (import.meta.env.DEV) {
      return {
        success: true,
        server: {
          ...config,
          id: Date.now().toString(),
          addedAt: new Date().toISOString()
        }
      };
    }

    const response = await api.post('/smtp/server', {
      ...config,
      port: parseInt(config.port, 10)
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(error.response.data.error);
    }
    throw new Error('Failed to save SMTP server');
  }
}