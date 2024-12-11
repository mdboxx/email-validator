import { ValidationResult } from '../../../utils/validation/validationResult.js';
import { logger } from '../../../utils/logger.js';

export class RoleBasedValidator {
  static readonly RESTRICTED_ROLES = [
    'admin',
    'administrator',
    'hostmaster',
    'postmaster',
    'webmaster',
    'no-reply',
    'noreply',
    'do-not-reply',
    'donotreply'
  ];

  static validate(email) {
    try {
      const localPart = email.split('@')[0].toLowerCase();
      
      // Check for restricted roles
      const matchedRole = this.RESTRICTED_ROLES.find(role => 
        localPart === role || localPart.startsWith(`${role}.`) || localPart.endsWith(`.${role}`)
      );

      if (matchedRole) {
        return ValidationResult.failure('Role-based email address detected', {
          role: matchedRole,
          type: 'restricted'
        });
      }

      return ValidationResult.success({
        localPart,
        isRoleBased: false
      });
    } catch (error) {
      logger.error('Role-based validation error:', error);
      return ValidationResult.failure('Role-based validation failed');
    }
  }
}