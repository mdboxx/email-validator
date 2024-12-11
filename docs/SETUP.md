# Setup Guide

## Prerequisites

- Node.js 18 or higher
- Redis (optional, for distributed caching)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Copy `.env.example` to `.env` and configure:
```bash
cp .env.example .env
```

4. Configure environment variables:
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `EMAIL_VALIDATION_API_KEY`: External validation service API key
- `SMTP_*`: SMTP server configuration
- `RATE_LIMIT_*`: Rate limiting settings
- `CACHE_*`: Cache configuration
- `LOG_*`: Logging settings

## Running the Application

Development:
```bash
npm run dev
```

Production:
```bash
npm start
```

## Testing

Run all tests:
```bash
npm test
```

Integration tests:
```bash
npm run test:integration
```

Load testing:
```bash
npm run test:load
```