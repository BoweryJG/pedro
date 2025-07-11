# Environment Variable Validation

This project includes comprehensive environment variable validation for both frontend and backend to ensure all required configuration is present before starting the application.

## Quick Start

### Backend Validation

```bash
# Validate environment variables
cd backend
npm run validate

# Show all available environment variables
npm run validate:schema

# Start server with automatic validation
npm start

# Start server without validation (not recommended)
npm run start:no-validation
```

### Frontend Validation

```bash
# Validate environment variables
cd frontend
npm run validate

# Build with automatic validation
npm run build

# Build without validation (not recommended)
npm run build:no-validation
```

## How It Works

### Backend Validation

1. **Automatic Validation on Startup**: When you run `npm start`, the server automatically validates all environment variables before starting.

2. **Required Variables**: The server will not start if any required variables are missing or invalid.

3. **Optional Variables**: Missing optional variables will show warnings but won't prevent startup.

4. **Validation Rules**: Each variable has specific validation rules (e.g., API keys must match expected formats).

### Frontend Validation

1. **Build-Time Validation**: The frontend validates environment variables during the build process.

2. **Runtime Validation**: The application also validates variables when loading in the browser (development mode only).

3. **Feature Flags**: Optional variables control feature availability (e.g., financing, insurance verification).

## Environment Variables

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `SUPABASE_URL` | Supabase project URL | `https://your-project.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | `sk-ant-api03-xxxxxxxxxxxxx` |
| `OPENROUTER_API_KEY` | OpenRouter API key | `sk-or-v1-xxxxxxxxxxxxx` |
| `TWILIO_ACCOUNT_SID` | Twilio account SID | `ACxxxxxxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | Twilio auth token | `your_twilio_auth_token` |
| `TWILIO_PHONE_NUMBER` | Twilio phone number | `+1234567890` |
| `NODE_ENV` | Environment mode | `production` or `development` |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001/api` |

## Error Messages

### Missing Required Variable
```
❌ Environment validation failed!

🚨 ERRORS (must be fixed):
──────────────────────────────────────────────────
1. SUPABASE_URL
   Error: Missing required environment variable: SUPABASE_URL
   Description: Supabase project URL
   Example: https://your-project.supabase.co
```

### Invalid Variable Format
```
❌ Environment validation failed!

🚨 ERRORS (must be fixed):
──────────────────────────────────────────────────
1. TWILIO_PHONE_NUMBER
   Error: Invalid value for TWILIO_PHONE_NUMBER
   Description: Twilio phone number for voice/SMS
   Example: +1234567890
   Current value: 123456789...
```

### Optional Variable Warning
```
⚠️  WARNINGS (optional but recommended):
──────────────────────────────────────────────────
1. ELEVENLABS_API_KEY
   Warning: Optional variable ELEVENLABS_API_KEY not set
   Description: ElevenLabs API key for text-to-speech
   Example: your_elevenlabs_api_key
```

## Setting Up Environment Variables

1. **Copy the example file**:
   ```bash
   # Backend
   cd backend
   cp .env.example .env
   
   # Frontend
   cd frontend
   cp .env.example .env
   ```

2. **Fill in your values**: Open the `.env` file and replace the placeholder values with your actual credentials.

3. **Validate your setup**:
   ```bash
   # Backend
   npm run validate
   
   # Frontend
   npm run validate
   ```

## Advanced Usage

### JSON Output

Get validation results as JSON for programmatic use:

```bash
# Backend
npm run validate:json

# Returns JSON like:
{
  "valid": true,
  "errors": [],
  "warnings": [...],
  "config": {...}
}
```

### Custom Validation

Add custom validation rules in the validator files:

```javascript
// backend/src/utils/envValidator.js
CUSTOM_API_KEY: {
  description: 'Custom API key',
  example: 'custom-key-format',
  validate: (value) => {
    // Custom validation logic
    return value.startsWith('custom-') && value.length > 10;
  }
}
```

## Troubleshooting

### Server Won't Start

1. Run `npm run validate` to see what's missing
2. Check that your `.env` file exists
3. Ensure all required variables are set
4. Verify variable formats match expected patterns

### Build Fails

1. Run `npm run validate` in the frontend directory
2. Check that `VITE_API_URL` is set correctly
3. Use `npm run build:no-validation` to bypass validation (not recommended)

### Production Deployment

1. Set all environment variables in your hosting platform
2. Don't commit `.env` files to version control
3. Use different values for production vs development
4. Enable all optional variables for full functionality

## Security Notes

- Never commit `.env` files to version control
- Use strong, unique values for secrets and API keys
- Rotate credentials regularly
- Use environment-specific values (dev/staging/production)
- Keep service role keys secure and limit access