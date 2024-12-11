import compression from 'compression';
import { logger } from '../utils/logger.js';

const shouldCompress = (req, res) => {
  if (req.headers['x-no-compression']) {
    return false;
  }
  return compression.filter(req, res);
};

export const performanceMiddleware = [
  compression({ filter: shouldCompress }),
  (req, res, next) => {
    const start = process.hrtime();
    
    res.on('finish', () => {
      const [seconds, nanoseconds] = process.hrtime(start);
      const duration = seconds * 1000 + nanoseconds / 1e6;
      
      logger.info('Performance metrics', {
        path: req.path,
        method: req.method,
        duration,
        status: res.statusCode,
        contentLength: res.get('Content-Length'),
        contentEncoding: res.get('Content-Encoding')
      });
    });
    
    next();
  }
];