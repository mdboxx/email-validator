# Email Validation System Usage Guide

## Basic Usage

```javascript
import { EmailValidationService } from './services/emailValidation';

const validator = new EmailValidationService();

// Single email validation
const result = await validator.validateEmail('test@example.com');

// Bulk validation
const results = await validator.validateBulk([
  'test1@example.com',
  'test2@example.com'
]);
```

## Configuration Options

```javascript
const options = {
  skipCache: false,        // Skip cache check
  forceFresh: false,       // Force fresh validation
  timeout: 5000,          // Timeout in milliseconds
  retryAttempts: 3,       // Number of retry attempts
  checkDisposable: true,  // Check for disposable emails
  checkCatchAll: true,    // Check for catch-all domains
  checkRoleBased: true    // Check for role-based emails
};

const result = await validator.validateEmail('test@example.com', options);
```

## Response Format

```javascript
{
  isValid: boolean,
  email: string,
  details: {
    syntax: {
      valid: boolean,
      errors: string[]
    },
    domain: {
      valid: boolean,
      mxRecords: Array<MxRecord>
    },
    smtp: {
      valid: boolean,
      response: string
    },
    disposable: {
      isDisposable: boolean,
      evidence: string
    }
  },
  metadata: {
    duration: number,
    timestamp: string
  }
}
```

## Error Handling

```javascript
try {
  const result = await validator.validateEmail('test@example.com');
} catch (error) {
  if (error.code === 'RATE_LIMIT_EXCEEDED') {
    // Handle rate limiting
  } else if (error.code === 'VALIDATION_ERROR') {
    // Handle validation errors
  } else {
    // Handle other errors
  }
}
```

## Rate Limiting

Default limits:
- 100 requests per minute per IP
- 1000 requests per hour per API key
- Configurable via environment variables

## Caching

Default configuration:
- TTL: 1 hour
- Max size: 10,000 entries
- Configurable via environment variables