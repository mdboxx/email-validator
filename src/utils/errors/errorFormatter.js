export class ErrorFormatter {
  static format(error, context = {}) {
    return {
      type: error.name || 'Error',
      message: error.message,
      code: error.code,
      details: error.details || {},
      context,
      timestamp: new Date().toISOString()
    };
  }

  static formatValidationError(error) {
    return {
      type: 'ValidationError',
      message: error.message,
      validations: error.details?.validations || [],
      timestamp: new Date().toISOString()
    };
  }

  static formatConnectionError(error) {
    return {
      type: 'ConnectionError',
      message: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      timestamp: new Date().toISOString()
    };
  }
}