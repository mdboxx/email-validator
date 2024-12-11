export class ValidationResultFormatter {
  /**
   * Format validation result into standardized structure
   * @param {Object} result - Raw validation result
   * @param {Object} options - Formatting options
   * @returns {Object} Formatted result
   */
  static format(result, options = {}) {
    const formatted = {
      success: result.isValid,
      timestamp: new Date().toISOString(),
      email: options.email,
      errors: result.errors || [],
      details: {}
    };

    // Include validation stages if they exist
    if (result.details) {
      if (result.details.syntax) {
        formatted.details.syntax = {
          valid: result.details.syntax.isValid,
          errors: result.details.syntax.errors
        };
      }

      if (result.details.domain) {
        formatted.details.domain = {
          valid: result.details.domain.isValid,
          value: result.details.domain.domain,
          errors: result.details.domain.errors
        };
      }

      if (result.details.mx) {
        formatted.details.mx = {
          valid: result.details.mx.isValid,
          records: result.details.mx.records
        };
      }

      if (result.details.smtp) {
        formatted.details.smtp = {
          valid: result.details.smtp.isValid,
          response: result.details.smtp.smtp
        };
      }
    }

    // Include rate limit info if provided
    if (options.rateLimit) {
      formatted.rateLimit = {
        remaining: options.rateLimit.remaining,
        reset: options.rateLimit.reset
      };
    }

    return formatted;
  }
}