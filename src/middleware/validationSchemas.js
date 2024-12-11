export const validationSchemas = {
  emailValidation: {
    email: {
      in: ['body'],
      isEmail: {
        errorMessage: 'Invalid email format'
      },
      normalizeEmail: true,
      trim: true,
      notEmpty: {
        errorMessage: 'Email is required'
      }
    }
  },
  smtpConfig: {
    'host': {
      in: ['body'],
      isString: true,
      notEmpty: {
        errorMessage: 'SMTP host is required'
      }
    },
    'port': {
      in: ['body'],
      isInt: {
        options: { min: 1, max: 65535 },
        errorMessage: 'Port must be between 1 and 65535'
      }
    },
    'secure': {
      in: ['body'],
      isBoolean: true,
      optional: true,
      default: false
    },
    'auth.user': {
      in: ['body'],
      isString: true,
      optional: true
    },
    'auth.pass': {
      in: ['body'],
      isString: true,
      optional: true
    }
  }
};