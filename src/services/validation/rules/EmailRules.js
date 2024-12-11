export class EmailRules {
  static readonly MAX_LENGTH = 254;
  static readonly LOCAL_PART_MAX_LENGTH = 64;
  static readonly DOMAIN_MAX_LENGTH = 255;

  static validateSyntax(email) {
    const errors = [];
    
    if (!email || typeof email !== 'string') {
      errors.push('Email is required and must be a string');
      return errors;
    }

    if (email.length > this.MAX_LENGTH) {
      errors.push(`Email must not exceed ${this.MAX_LENGTH} characters`);
    }

    const [localPart, domain] = email.split('@');

    if (!localPart || !domain) {
      errors.push('Email must contain exactly one @ symbol');
      return errors;
    }

    this.validateLocalPart(localPart, errors);
    this.validateDomain(domain, errors);

    return errors;
  }

  private static validateLocalPart(localPart, errors) {
    if (localPart.length > this.LOCAL_PART_MAX_LENGTH) {
      errors.push(`Local part must not exceed ${this.LOCAL_PART_MAX_LENGTH} characters`);
    }

    if (localPart.startsWith('.') || localPart.endsWith('.')) {
      errors.push('Local part must not start or end with a dot');
    }

    if (localPart.includes('..')) {
      errors.push('Local part must not contain consecutive dots');
    }
  }

  private static validateDomain(domain, errors) {
    if (domain.length > this.DOMAIN_MAX_LENGTH) {
      errors.push(`Domain must not exceed ${this.DOMAIN_MAX_LENGTH} characters`);
    }

    if (!/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9](\.[a-zA-Z]{2,})+$/.test(domain)) {
      errors.push('Invalid domain format');
    }
  }
}