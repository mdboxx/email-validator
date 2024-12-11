export class ConnectionError {
  static format(error) {
    return {
      message: error.message,
      code: error.code,
      command: error.command,
      responseCode: error.responseCode,
      timestamp: new Date().toISOString()
    };
  }

  static isTransient(error) {
    const transientCodes = ['ECONNREFUSED', 'ETIMEDOUT', 'ENOTFOUND'];
    return transientCodes.includes(error.code);
  }

  static shouldRetry(error, retryCount) {
    return this.isTransient(error) && retryCount < 3;
  }
}