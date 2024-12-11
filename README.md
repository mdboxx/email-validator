# Email Cleaning Service

A comprehensive email cleaning and validation service with syntax checking, domain validation, MX record verification, SMTP verification, and disposable email detection.

## Features

- Multi-stage email validation
  - Syntax validation
  - Domain validation
  - MX record verification
  - SMTP verification
  - Disposable email detection
  - Role-based email detection
  - Catch-all domain detection
  - Typo detection and suggestions

- Advanced Features
  - Caching with multiple strategies (Memory, Redis)
  - Rate limiting
  - Performance monitoring
  - Comprehensive metrics collection
  - API documentation
  - Bulk validation support

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
```

3. Start the service:
```bash
npm run dev
```

## API Documentation

Access the API documentation at:
```
http://localhost:3000/api-docs
```

### Example Usage

```javascript
// Validate a single email
POST /api/validate/email
{
  "email": "test@example.com"
}

// Bulk validation
POST /api/validate/bulk
{
  "emails": ["test1@example.com", "test2@example.com"]
}
```

## Testing

```bash
# Run all tests
npm test

# Run integration tests
npm run test:integration

# Run load tests
npm run test:load
```

## Monitoring

Access metrics dashboard:
```
http://localhost:3000/metrics
```

## License

MIT

Powered by MDBOX