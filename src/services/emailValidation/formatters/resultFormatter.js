export class ValidationResultFormatter {
  static format(result, options = {}) {
    return {
      success: result.isValid,
      timestamp: new Date().toISOString(),
      email: options.email,
      errors: result.errors || [],
      details: this.formatDetails(result),
      rateLimit: this.formatRateLimit(options.rateLimit)
    };
  }

  static formatDetails(result) {
    if (!result.details) return {};

    return {
      syntax: this.formatSyntaxDetails(result.details.syntax),
      domain: this.formatDomainDetails(result.details.domain),
      mx: this.formatMxDetails(result.details.mx),
      smtp: this.formatSmtpDetails(result.details.smtp)
    };
  }

  static formatSyntaxDetails(syntax) {
    if (!syntax) return null;
    return {
      valid: syntax.isValid,
      errors: syntax.errors
    };
  }

  static formatDomainDetails(domain) {
    if (!domain) return null;
    return {
      valid: domain.isValid,
      value: domain.domain,
      errors: domain.errors
    };
  }

  static formatMxDetails(mx) {
    if (!mx) return null;
    return {
      valid: mx.isValid,
      records: mx.records
    };
  }

  static formatSmtpDetails(smtp) {
    if (!smtp) return null;
    return {
      valid: smtp.isValid,
      response: smtp.smtp
    };
  }

  static formatRateLimit(rateLimit) {
    if (!rateLimit) return null;
    return {
      remaining: rateLimit.remaining,
      reset: rateLimit.reset
    };
  }
}