# Dr. Pedro Advanced Dental Care - Instagram DM Automation System

## 🚀 Overview

This is a comprehensive Instagram DM automation system built specifically for Dr. Pedro's dental practice. It features Claude AI integration for intelligent patient responses, automated appointment booking, and a complete practice management dashboard.

## 🎯 Key Features

### AI-Powered Instagram DM Management
- **Claude AI Integration**: Medical-specific responses trained for dental practice
- **24/7 Automated Responses**: Instant replies to patient inquiries
- **Appointment Booking**: Intelligent extraction of booking requests from DMs
- **Sentiment Analysis**: Monitor patient satisfaction in real-time
- **Human Oversight**: Flag complex cases for manual review

### Practice Dashboard
- **Real-time Conversation Management**: View and respond to all Instagram DMs
- **Analytics Dashboard**: Track message volume, response times, and patient satisfaction
- **Appointment Requests**: Manage booking requests from Instagram conversations
- **AI Confidence Monitoring**: Review and improve automated responses

### Technical Architecture
- **Frontend**: React + TypeScript + Material-UI
- **Backend**: Node.js + Express + Supabase
- **AI**: Claude 3.5 Sonnet (Anthropic)
- **Integration**: Facebook Graph API + Instagram Basic Display API
- **Database**: PostgreSQL with Row Level Security

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- Facebook Developer Account with verified business app
- Instagram Business Account
- Anthropic API key (Claude AI)

### 1. Environment Configuration

Create `.env` files in both frontend and backend directories:

**Frontend (.env):**
```bash
VITE_BACKEND_URL=http://localhost:3001
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Backend (.env):**
```bash
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Anthropic Claude AI
ANTHROPIC_API_KEY=your_anthropic_api_key

# Facebook/Instagram API
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_access_token
FACEBOOK_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
INSTAGRAM_PAGE_ID=your_instagram_business_page_id

# Server
PORT=3001
NODE_ENV=production
```

### 2. Database Setup

Run the migration in your Supabase SQL editor:

```bash
# Copy the contents of backend/supabase/migrations/20250616_instagram_dm_automation.sql
# and execute in Supabase SQL Editor
```

This creates all necessary tables:
- `practices` - Practice information and settings
- `instagram_conversations` - DM thread tracking
- `instagram_messages` - Individual message storage
- `ai_responses` - Response templates and analytics
- `appointment_requests` - Booking requests from DMs
- `dm_analytics` - Performance metrics

### 3. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install

# Install backend dependencies
cd ../backend && npm install
```

### 4. Development

```bash
# Start both frontend and backend in development mode
npm run dev:all

# Or start individually
npm run dev:frontend  # Starts React dev server (port 5173)
npm run dev:backend   # Starts Express server (port 3001)
```

### 5. Access the Application

- **Frontend Website**: http://localhost:5173
- **Instagram Dashboard**: http://localhost:5173/instagram-dashboard
- **Backend API**: http://localhost:3001
- **Webhook Endpoint**: http://localhost:3001/api/instagram/webhook

## 🏗️ Project Structure

```
pedro/
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── InstagramDashboard.tsx  # Main DM management interface
│   │   │   └── BackendStatus.tsx       # Backend connection monitor
│   │   ├── pages/          # Practice website pages
│   │   ├── chatbot/        # Website chatbot
│   │   └── theme/          # UI theme configuration
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                # Node.js backend server
│   ├── src/
│   │   ├── services/
│   │   │   ├── instagramDMHandler.js    # Core DM processing logic
│   │   │   └── appointmentBooking.js    # Appointment extraction & booking
│   │   ├── routes/
│   │   │   └── instagram-webhook.js     # API endpoints & webhook handlers
│   │   └── index.js        # Server entry point
│   ├── supabase/
│   │   └── migrations/
│   │       └── 20250616_instagram_dm_automation.sql  # Database schema
│   ├── package.json
│   └── Dockerfile
│
├── package.json            # Monorepo workspace configuration
└── README.md              # This file
```

## 🧠 AI System Behavior

### Response Intelligence
The Claude AI system is specifically trained for dental practices with:

- **HIPAA Compliance**: Never requests or discusses specific medical information
- **Professional Tone**: Warm but professional responses appropriate for healthcare
- **Procedure Knowledge**: Understands Yomi robotic surgery, TMJ treatment, EMFACE, etc.
- **Appointment Routing**: Intelligently routes booking requests to appropriate staff
- **Emergency Detection**: Flags urgent dental emergencies for immediate human attention

### Confidence Scoring
- **High Confidence (0.8+)**: Auto-respond with no human review
- **Medium Confidence (0.5-0.8)**: Auto-respond but flag for review
- **Low Confidence (<0.5)**: Hold for human review before sending

### Human Review Triggers
- Emergency keywords (pain, swollen, bleeding)
- Pricing/insurance questions
- Complaints or negative sentiment
- Complex medical questions requiring diagnosis

## 📊 Analytics & Monitoring

### Key Metrics Tracked
- **Message Volume**: Total DMs received per day
- **AI Response Rate**: Percentage handled by automation
- **Response Time**: Average time from message to reply
- **Appointment Conversions**: Bookings generated from DMs
- **Patient Satisfaction**: Sentiment analysis scores

### Dashboard Features
- Real-time conversation view
- Message history with AI confidence scores
- Appointment request management
- Performance analytics and trends
- AI response quality monitoring

## 🚀 Revenue Potential

### Market Opportunity
- **Current Problem**: Dental practices miss 40% of Instagram inquiries
- **Average Response Time**: 2-3 days without automation
- **Cost Savings**: Replaces $3,000-$5,000/month social media manager
- **Patient Satisfaction**: 24/7 availability improves experience

### Pricing Tiers
- **Basic**: $497/month - Auto-response and basic analytics
- **Professional**: $997/month - AI responses + appointment booking
- **Enterprise**: $2,497/month - Full automation + multi-platform

## 📄 License

Private repository for Dr. Pedro Advanced Dental Care. All rights reserved.

---

**Built with ❤️ for Dr. Pedro's Practice**
*Revolutionizing dental patient communication through AI automation*