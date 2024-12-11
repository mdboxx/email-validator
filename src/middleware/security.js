import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

const corsOptions = {
  origin: config.env === 'development' ? '*' : ['https://example.com'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
};

const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // allow 50 requests per 15 minutes, then...
  delayMs: 500 // begin adding 500ms of delay per request
});

export const securityMiddleware = [
  helmet({
    contentSecurityPolicy: config.env === 'production',
    crossOriginEmbedderPolicy: config.env === 'production',
    dnsPrefetchControl: true,
    expectCt: true,
    frameguard: true,
    hidePoweredBy: true,
    hsts: true,
    ieNoOpen: true,
    noSniff: true,
    permittedCrossDomainPolicies: true,
    referrerPolicy: true,
    xssFilter: true
  }),
  cors(corsOptions),
  rateLimiter,
  speedLimiter,
  (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
  },
  (err, req, res, next) => {
    logger.error('Security middleware error:', err);
    next(err);
  }
];