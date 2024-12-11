export class ValidationResult {
  constructor(isValid, errors = [], details = {}) {
    this.isValid = isValid;
    this.errors = Array.isArray(errors) ? errors : [errors];
    this.details = details;
    this.timestamp = new Date().toISOString();
  }

  static success(details = {}) {
    return new ValidationResult(true, [], details);
  }

  static failure(errors, details = {}) {
    return new ValidationResult(false, errors, details);
  }

  addError(error) {
    this.errors.push(error);
    this.isValid = false;
    return this;
  }

  addDetails(details) {
    this.details = { ...this.details, ...details };
    return this;
  }

  toJSON() {
    return {
      isValid: this.isValid,
      errors: this.errors,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}