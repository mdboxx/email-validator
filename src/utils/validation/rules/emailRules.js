export class EmailRules {
  static readonly MAX_LOCAL_PART_LENGTH = 64;
  static readonly MAX_DOMAIN_LENGTH = 255;
  static readonly MAX_TOTAL_LENGTH = 254;
  static readonly ALLOWED_SPECIAL_CHARS = '!#$%&\'*+-/=?^_`{|}~.';

  static validateLocalPart(localPart) {
    const errors = [];

    if (!localPart || localPart.length > this.MAX_LOCAL_PART_LENGTH) {
      errors.push('Local part exceeds maximum length');
    }

    if (localPart.includes('..')) {
      errors.push('Local part contains consecutive dots');
    }

    if (localPart.startsWith('.') || localPart.endsWith('.')) {
      errors.push('Local part cannot start or end with a dot');
    }

    const allowedPattern = new RegExp(
      `^[a-zA-Z0-9${this.ALLOWED_SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]+$`
    );
    
    if (!allowedPattern.test(localPart)) {
      errors.push('Local part contains invalid characters');
    }

    return errors;
  }

  static validateDomain(domain) {
    const errors = [];

    if (!domain || domain.length > this.MAX_DOMAIN_LENGTH) {
      errors.push('Domain exceeds maximum length');
    }

    const domainPattern = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!domainPattern.test(domain)) {
      errors.push('Invalid domain format');
    }

    return errors;
  }
}