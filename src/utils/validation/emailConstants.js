export const EmailConstants = {
  // Local part constraints
  LOCAL_PART: {
    MAX_LENGTH: 64,
    ALLOWED_SPECIAL_CHARS: '!#$%&\'*+-/=?^_`{|}~.',
    PATTERN: /^[a-zA-Z0-9!#$%&'*+\-/=?^_`{|}~.]+$/
  },

  // Domain constraints
  DOMAIN: {
    MAX_LENGTH: 255,
    PATTERN: /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
  },

  // Total email length
  MAX_TOTAL_LENGTH: 254,

  // Error messages
  ERRORS: {
    INVALID_INPUT: 'Invalid email input',
    INVALID_FORMAT: 'Invalid email format',
    LOCAL_PART_LENGTH: 'Local part exceeds maximum length',
    DOMAIN_LENGTH: 'Domain exceeds maximum length',
    TOTAL_LENGTH: 'Email address exceeds maximum length',
    CONSECUTIVE_DOTS: 'Local part contains consecutive dots',
    LEADING_DOT: 'Local part starts with a dot',
    TRAILING_DOT: 'Local part ends with a dot',
    INVALID_CHARS: 'Local part contains invalid characters',
    INVALID_DOMAIN: 'Invalid domain format'
  }
};