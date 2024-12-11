import { logger } from '../utils/logger.js';
import { ValidationError } from '../utils/errors/validationError.js';
import { ErrorFormatter } from '../utils/errors/errorFormatter.js';

export const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error:', err);

  if (err instanceof ValidationError) {
    return res.status(400).json({
      error: ErrorFormatter.formatValidationError(err)
    });
  }

  const formattedError = ErrorFormatter.format(err, {
    path: req.path,
    method: req.method
  });

  res.status(500).json({
    error: {
      message: 'Internal server error',
      ...formattedError
    }
  });
};