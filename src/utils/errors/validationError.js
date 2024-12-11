export class ValidationError extends Error {
  constructor(message, code, details = {}) {
    super(message);
    this.name = 'ValidationError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  static fromError(error, code = 'VALIDATION_ERROR') {
    return new ValidationError(error.message, code, {
      originalError: error.message,
      stack: error.stack
    });
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}