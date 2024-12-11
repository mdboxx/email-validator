import { validationConfig } from './validation.config.js';

// Load environment variables from import.meta.env (Vite's way of handling env vars)
const env = import.meta.env;

export const config = {
  port: env.VITE_PORT || 3000,
  env: env.MODE || 'development',
  dataDir: 'data',
  logDir: 'logs',
  uploadDir: 'uploads',
  
  emailValidation: {
    apiKey: env.VITE_EMAIL_VALIDATION_API_KEY,
    apiUrl: env.VITE_EMAIL_VALIDATION_API_URL,
    ...validationConfig
  },

  smtp: {
    host: env.VITE_SMTP_HOST,
    port: parseInt(env.VITE_SMTP_PORT, 10),
    secure: env.VITE_SMTP_SECURE === 'true',
    auth: {
      user: env.VITE_SMTP_USER,
      pass: env.VITE_SMTP_PASS
    }
  },

  rateLimiting: {
    points: parseInt(env.VITE_RATE_LIMIT_POINTS, 10) || validationConfig.rateLimiting.points,
    duration: parseInt(env.VITE_RATE_LIMIT_DURATION, 10) || validationConfig.rateLimiting.duration,
    blockDuration: validationConfig.rateLimiting.blockDuration
  },

  cache: {
    ttl: parseInt(env.VITE_CACHE_TTL, 10) || validationConfig.cache.ttl,
    maxSize: parseInt(env.VITE_CACHE_MAX_SIZE, 10) || validationConfig.cache.maxSize
  },

  logging: {
    level: env.VITE_LOG_LEVEL || 'info',
    filePath: env.VITE_LOG_FILE_PATH || 'logs/app.log'
  }
};