import { ValidationResult } from '../../../utils/validation/validationResult.js';
import { logger } from '../../../utils/logger.js';

export class RoleBasedValidator {
  constructor() {
    this.restrictedRoles = new Set([
      'admin',
      'administrator',
      'postmaster',
      'hostmaster',
      'webmaster',
      'no-reply',
      'noreply',
      'do-not-reply',
      'donotreply',
      'support',
      'info',
      'sales',
      'contact',
      'marketing'
    ]);
  }

  validate(email) {
    try {
      const localPart = email.split('@')[0].toLowerCase();
      
      // Check for exact matches
      if (this.restrictedRoles.has(localPart)) {
        return ValidationResult.failure('Role-based email detected', {
          role: localPart,
          type: 'exact-match'
        });
      }

      // Check for prefixes/suffixes
      for (const role of this.restrictedRoles) {
        if (localPart.startsWith(`${role}.`) || localPart.endsWith(`.${role}`)) {
          return ValidationResult.failure('Role-based email detected', {
            role,
            type: 'prefix-suffix-match'
          });
        }
      }

      return ValidationResult.success({
        isRoleBased: false,
        localPart
      });
    } catch (error) {
      logger.error('Role-based validation error:', error);
      return ValidationResult.failure('Role validation failed');
    }
  }

  isRoleBasedEmail(localPart) {
    return this.restrictedRoles.has(localPart.toLowerCase());
  }

  addRestrictedRole(role) {
    this.restrictedRoles.add(role.toLowerCase());
  }

  removeRestrictedRole(role) {
    this.restrictedRoles.delete(role.toLowerCase());
  }
}