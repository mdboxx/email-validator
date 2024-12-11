export const rateLimitingConfig = {
  ip: {
    points: 100,      // 100 requests
    duration: 3600,   // per hour
    blockDuration: 1800 // 30 minutes block
  },
  apiKey: {
    points: 1000,     // 1000 requests
    duration: 3600,   // per hour
    blockDuration: 3600 // 1 hour block
  },
  quota: {
    points: 10000,    // 10000 requests
    duration: 86400,  // per day
    blockDuration: 86400 // 1 day block
  }
};