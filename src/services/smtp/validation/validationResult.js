export class SmtpValidationResult {
  constructor(isValid, details = {}, error = null) {
    this.isValid = isValid;
    this.details = details;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }

  static success(details = {}) {
    return new SmtpValidationResult(true, details);
  }

  static failure(error, details = {}) {
    return new SmtpValidationResult(false, details, error);
  }

  toJSON() {
    return {
      isValid: this.isValid,
      details: this.details,
      error: this.error,
      timestamp: this.timestamp
    };
  }
}