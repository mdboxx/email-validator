import express from 'express';
import { config } from './config/index.js';
import { logger, requestLogger } from './utils/logger.js';
import { fileHandler } from './utils/fileHandler.js';
import { setupRoutes } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import { securityMiddleware } from './middleware/security.js';
import { performanceMiddleware } from './middleware/performance.js';
import { sanitizeRequest } from './middleware/validation.js';
import { setupSwagger } from './docs/swagger.js';

const app = express();

// Core middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Security middleware
app.use(securityMiddleware);

// Performance middleware
app.use(performanceMiddleware);

// Request processing middleware
app.use(requestLogger);
app.use(sanitizeRequest);
app.use(rateLimiter);

// Setup routes and documentation
setupRoutes(app);
setupSwagger(app);

// Global error handler
app.use(errorHandler);

// Ensure required directories exist
await Promise.all([
  fileHandler.ensureDir(config.dataDir),
  fileHandler.ensureDir(config.logDir),
  fileHandler.ensureDir(config.uploadDir)
]);

const server = app.listen(config.port, () => {
  logger.info(`Server running on port ${config.port} in ${config.env} mode`);
  logger.info(`API documentation available at http://localhost:${config.port}/api-docs`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Starting graceful shutdown...');
  server.close(() => {
    logger.info('Server closed. Process terminating...');
    process.exit(0);
  });
});

export default app;