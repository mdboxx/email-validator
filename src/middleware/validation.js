import { validationResult, checkSchema } from 'express-validator';
import { ValidationError } from '../utils/errors/validationError.js';
import { validationSchemas } from './validationSchemas.js';
import { logger } from '../utils/logger.js';

export const validateRequest = (schemaName) => {
  if (!validationSchemas[schemaName]) {
    throw new Error(`Validation schema '${schemaName}' not found`);
  }

  return [
    checkSchema(validationSchemas[schemaName]),
    (req, res, next) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          throw new ValidationError(
            'Validation failed',
            'VALIDATION_ERROR',
            errors.array()
          );
        }
        next();
      } catch (error) {
        logger.error('Validation middleware error:', error);
        next(error);
      }
    }
  ];
};

export const sanitizeRequest = (req, res, next) => {
  try {
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase().trim();
    }
    next();
  } catch (error) {
    logger.error('Request sanitization error:', error);
    next(error);
  }
};