/**
 * Handles parsing and extraction of email components
 */
export class EmailParser {
  /**
   * Parse email into its components
   * @param {string} email - Email address to parse
   * @returns {Object} Parsed email components
   */
  static parse(email) {
    try {
      const [localPart, domain] = email.split('@');
      return {
        success: true,
        localPart,
        domain,
        error: null
      };
    } catch (error) {
      return {
        success: false,
        localPart: null,
        domain: null,
        error: 'Invalid email format'
      };
    }
  }

  /**
   * Extract domain from email address
   * @param {string} email - Email address
   * @returns {string|null} Domain or null if invalid
   */
  static extractDomain(email) {
    const parsed = this.parse(email);
    return parsed.success ? parsed.domain : null;
  }

  /**
   * Extract local part from email address
   * @param {string} email - Email address
   * @returns {string|null} Local part or null if invalid
   */
  static extractLocalPart(email) {
    const parsed = this.parse(email);
    return parsed.success ? parsed.localPart : null;
  }
}