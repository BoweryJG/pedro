# Environment Variable Validation - Quick Start

## 🚀 Quick Commands

### Backend
```bash
cd backend
npm run validate          # Check environment variables
npm run validate:schema   # Show all available variables
npm start                 # Start with validation
```

### Frontend
```bash
cd frontend
npm run validate          # Check environment variables
npm run build             # Build with validation
```

## 🔧 Setup Steps

1. **Copy example files**:
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   
   # Frontend
   cp frontend/.env.example frontend/.env
   ```

2. **Fill in required values** in the `.env` files

3. **Validate your setup**:
   ```bash
   # Backend
   cd backend && npm run validate
   
   # Frontend
   cd frontend && npm run validate
   ```

## ❌ Common Errors

### Missing Required Variable
```
❌ Environment validation failed!
1. SUPABASE_URL
   Error: Missing required environment variable: SUPABASE_URL
   Example: https://your-project.supabase.co
```
**Fix**: Add `SUPABASE_URL=https://your-project.supabase.co` to backend/.env

### Invalid Format
```
❌ Environment validation failed!
1. TWILIO_PHONE_NUMBER
   Error: Invalid value for TWILIO_PHONE_NUMBER
   Example: +1234567890
```
**Fix**: Ensure phone number includes country code: `+1234567890`

## ✅ Required Variables

### Backend (Must Have)
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `ANTHROPIC_API_KEY` - Claude API key
- `OPENROUTER_API_KEY` - OpenRouter API key
- `TWILIO_ACCOUNT_SID` - Twilio account SID
- `TWILIO_AUTH_TOKEN` - Twilio auth token
- `TWILIO_PHONE_NUMBER` - Twilio phone number
- `NODE_ENV` - Set to 'production' or 'development'

### Frontend (Must Have)
- `VITE_API_URL` - Backend API URL (default: http://localhost:3001/api)

## 📝 Full Documentation

See `/docs/ENVIRONMENT_VALIDATION.md` for complete documentation.