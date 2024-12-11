export const validationConfig = {
  syntax: {
    maxLocalPartLength: 64,
    maxDomainLength: 255,
    maxTotalLength: 254,
    allowedSpecialChars: '!#$%&\'*+-/=?^_`{|}~.'
  },
  smtp: {
    connectionTimeout: 5000,
    retryAttempts: 3,
    retryDelay: 1000
  },
  cache: {
    ttl: 3600000, // 1 hour
    maxSize: 10000
  },
  rateLimiting: {
    points: 10,
    duration: 1, // seconds
    blockDuration: 60 // seconds
  },
  security: {
    corsOrigins: ['https://example.com'],
    maxRequestSize: '1mb',
    requestTimeout: 5000,
    helmet: {
      contentSecurityPolicy: true,
      crossOriginEmbedderPolicy: true,
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
    }
  }
};