export const ValidationConfig = {
  retryAttempts: 3,
  retryDelay: 1000,
  timeout: {
    smtp: 10000,
    dns: 5000,
    syntax: 1000
  },
  cache: {
    ttl: 3600000, // 1 hour
    maxSize: 10000
  }
};