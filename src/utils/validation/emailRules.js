export class EmailRules {
  static MAX_LOCAL_PART_LENGTH = 64;
  static MAX_DOMAIN_LENGTH = 255;
  static MAX_TOTAL_LENGTH = 254;
  static ALLOWED_SPECIAL_CHARS = '!#$%&\'*+-/=?^_`{|}~.';

  static validateLocalPart(localPart) {
    if (!localPart || localPart.length > this.MAX_LOCAL_PART_LENGTH) {
      return false;
    }

    // Check for consecutive dots
    if (localPart.includes('..')) {
      return false;
    }

    // Check for leading or trailing dots
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
      return false;
    }

    // Check for allowed characters
    const allowedPattern = new RegExp(
      `^[a-zA-Z0-9${this.ALLOWED_SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+$`
    );
    return allowedPattern.test(localPart);
  }

  static validateDomainPart(domain) {
    if (!domain || domain.length > this.MAX_DOMAIN_LENGTH) {
      return false;
    }

    // Check for valid domain format (letters, numbers, hyphens, dots)
    const domainPattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return domainPattern.test(domain);
  }

  static getValidationErrors(localPart, domain) {
    const errors = [];

    if (!this.validateLocalPart(localPart)) {
      errors.push('Invalid local part format');
    }

    if (!this.validateDomainPart(domain)) {
      errors.push('Invalid domain format');
    }

    if ((localPart + '@' + domain).length > this.MAX_TOTAL_LENGTH) {
      errors.push('Email address exceeds maximum length');
    }

    return errors;
  }
}