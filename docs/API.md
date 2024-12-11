# Email Validation API Documentation

## Endpoints

### POST /api/validate/email

Validates an email address using multiple validation stages.

```json
{
  "email": "test@example.com"
}
```

#### Response

```json
{
  "isValid": true,
  "details": {
    "syntax": {
      "valid": true,
      "localPart": "test",
      "domain": "example.com"
    },
    "domain": {
      "valid": true,
      "mxRecords": [
        {
          "exchange": "mx1.example.com",
          "priority": 10
        }
      ]
    },
    "smtp": {
      "valid": true,
      "response": "OK"
    }
  },
  "timestamp": "2024-01-20T12:00:00.000Z"
}
```

### POST /api/smtp/server

Adds a new SMTP server to the validation pool.

```json
{
  "host": "smtp.example.com",
  "port": 587,
  "secure": false,
  "auth": {
    "user": "user@example.com",
    "pass": "password"
  }
}
```

## Rate Limiting

- Default: 10 requests per second per IP
- Configurable via `RATE_LIMIT_POINTS` and `RATE_LIMIT_DURATION` environment variables

## Caching

- Default TTL: 1 hour
- Configurable via `CACHE_TTL` environment variable
- Supports both memory and Redis caching strategies