# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Architecture

This is a monorepo for Dr. Pedro's dental practice digital ecosystem with:
- **Frontend**: React/TypeScript SPA with MUI v7, built with Vite
- **Backend**: Node.js/Express API server handling voice AI, Instagram automation, and multi-tenant phone management
- **Subdomains**: 5 specialized service sites (TMJ, implants, robotic, medspa, aboutface)
- **Database**: Supabase (PostgreSQL with RLS)
- **Voice AI**: Eleven Labs TTS + Deepgram Voice Agent for phone calls
- **Phone System**: Twilio integration with multi-tenant management

## Development Commands

### Full Stack Development
```bash
# Install all dependencies (use --legacy-peer-deps)
npm run install:all

# Run frontend and backend concurrently
npm run dev:all

# Individual services
npm run dev:frontend  # http://localhost:5173
npm run dev:backend   # http://localhost:3001
```

### Build Commands
```bash
# Production build (frontend + backend)
npm run build:prod

# Development build
npm run build:dev

# Analyze bundle size
npm run build:analyze
```

### Frontend-Specific
```bash
cd frontend
npm run dev          # Start dev server
npm run build:prod   # Production build
npm run typecheck    # TypeScript validation
npm run lint         # ESLint check
npm run preview      # Preview production build
```

### Backend-Specific
```bash
cd backend
npm run dev          # Development with hot reload
npm start            # Production mode
npm run validate     # Validate environment variables
npm run db:migrate   # Run Supabase migrations
```

## Critical Service Integrations

### Voice AI System
- **Eleven Labs TTS**: Professional voice synthesis (backend/services/elevenLabsTTS.js)
- **Deepgram Voice Agent**: Handles incoming phone calls (backend/deepgramVoiceService.js)
- **Voice Service**: WebRTC and phone call processing (backend/voiceService.js)
- **Julie AI**: Conversational AI assistant (backend/services/julieAI.js)

### Multi-Tenant Phone Management
- Purchase and manage phone numbers per practice
- Individual voice settings per number
- Usage tracking and billing
- Located in: backend/services/phoneNumberManager.js

### Instagram DM Automation
- Claude AI-powered responses
- Appointment booking through DMs
- Located in: backend/src/services/instagramDMHandler.js

## Environment Variables

### Backend Required (.env)
```
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
ELEVENLABS_API_KEY=
DEEPGRAM_API_KEY=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
ANTHROPIC_API_KEY=
OPENROUTER_API_KEY=
HUGGINGFACE_TOKEN=
FACEBOOK_PAGE_ACCESS_TOKEN=
INSTAGRAM_PAGE_ID=
```

### Frontend Required (.env.local)
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_BACKEND_URL=http://localhost:3001
VITE_GOOGLE_MAPS_API_KEY=
```

## Key Architectural Patterns

### API Communication
- Frontend calls backend APIs for all AI services (OpenAI, Anthropic)
- No API keys stored in frontend code
- Backend handles all third-party integrations

### Voice Call Flow
```
Incoming Call → Twilio → Deepgram Voice Agent → Julie AI → Response
                          ↓
                    Appointment Booking → Supabase → SMS Confirmation
```

### Database Schema
- Multi-tenant structure: clients → phone_numbers → call_logs
- Appointments table with comprehensive tracking
- System settings for voice AI configuration
- Row-level security enabled on all tables

### Security Measures
- Rate limiting: 100 req/15min general, 10 req/15min sensitive
- Helmet.js security headers
- CORS whitelist protection
- Environment variable validation on startup
- No hardcoded secrets or API keys

## Testing Voice Features

### Test Eleven Labs Voices
```bash
cd backend
node test-nicole-voice.js  # Test Julie's voice
node test-all-voices.js    # Test all available voices
```

### Test Phone System
```bash
# Start backend with voice services
cd backend && npm run dev

# Call the configured Twilio number
# Or use the web interface for testing
```

## Deployment

### Backend (Render)
- Auto-deploys from main branch
- Root directory: backend
- Build: npm install
- Start: npm start

### Frontend (Netlify)
- Auto-deploys from main branch
- Build directory: frontend
- Build: npm run build
- Publish: dist

## Common Issues and Solutions

### Voice AI Not Working
1. Check ELEVENLABS_API_KEY is set
2. Verify DEEPGRAM_API_KEY is valid
3. Ensure Twilio webhook points to: https://[backend-url]/api/voice/incoming
4. Check phone number is configured in Twilio console

### Database Connection Issues
1. Verify SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
2. Check if database is paused in Supabase dashboard
3. Run migrations: cd backend && npm run db:migrate

### Build Failures
1. Always use --legacy-peer-deps for installations
2. Check Node version >= 18.0.0
3. Clear caches: npm run clean

### Multi-Tenant Phone Issues
1. Verify Twilio account has balance
2. Check phone_numbers table has correct configuration
3. Ensure voice_settings are properly set per number

## Important Files to Review

When making changes, always check:
- backend/ELEVENLABS_README.md - Comprehensive TTS documentation
- backend/src/utils/envValidator.js - Environment validation rules
- frontend/src/services/api.ts - Backend API integration
- backend/services/julieAI.js - Main AI conversation logic
- backend/deepgramVoiceService.js - Phone call handling