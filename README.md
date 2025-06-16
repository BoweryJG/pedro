# Staten Island Advanced Dentistry Platform

A modern, AI-powered dental practice website featuring an intelligent chatbot assistant and integrated smile simulation technology. Built with React, TypeScript, and cutting-edge web technologies.

## 🦷 Overview

This platform represents the digital presence of Staten Island Advanced Dentistry, led by Dr. Pedro (Prosthodontist and General Practitioner), specializing in advanced procedures including:
- Yomi Robotic Surgery
- TMJ Treatment
- EMFACE Facial Rejuvenation
- AI-Powered Smile Visualization

## 🤖 Sophie - AI Dental Assistant Chatbot

### Architecture & Logic

Sophie is a GPT-4 powered conversational AI designed to guide patients through their dental journey using the Socratic method of selling - asking thoughtful questions to help patients discover their own needs.

#### Core Components

1. **Conversation Engine** (`/src/chatbot/`)
   - **GPT-4 Integration**: Leverages OpenAI's latest model for natural, context-aware conversations
   - **State Management**: Uses Zustand for maintaining conversation state, booking intent, and user preferences
   - **Conversation Flow**: Implements a sophisticated flow system that adapts based on user responses

2. **Booking Intent Detection**
   - Tracks user engagement through conversation patterns
   - Progressively increases booking intent score (0-100%) based on:
     - Questions asked about procedures
     - Interest in pricing/financing
     - Scheduling inquiries
     - Pain points discussed
   - Visual progress indicator shows journey toward booking

3. **Socratic Selling Methodology**
   - Instead of pushing services, Sophie asks questions like:
     - "How long have you been experiencing this discomfort?"
     - "What would your ideal smile look like?"
     - "Have you considered how this might affect your daily life?"
   - Builds trust through empathetic responses
   - Educates while discovering patient needs

4. **Knowledge Base Integration**
   - Comprehensive information about all procedures
   - Real-time answers about insurance, financing, and scheduling
   - Contextual suggestions based on conversation history

### Key Features

- **Multi-stage Conversations**: Remembers context throughout the session
- **Financing Integration**: Ready for real-time approval checks with CareCredit/LendingClub APIs
- **Smart Suggestions**: Offers relevant quick responses based on conversation stage
- **Emotional Intelligence**: Adapts tone based on user's emotional state
- **Appointment Readiness**: Seamlessly transitions to booking when intent is high

### Technical Implementation

```typescript
// Conversation flow example
const analyzeIntent = (message: string, history: Message[]) => {
  // GPT-4 analyzes message in context
  // Returns intent score, suggested responses, and next actions
  return {
    bookingIntent: calculateBookingReadiness(message, history),
    suggestedResponses: generateContextualSuggestions(message),
    shouldShowFinancing: detectFinancingInterest(message)
  };
};
```

## 🎨 SmileLab AI Integration

### Overview

SmileLab is an embedded AI-powered smile visualization tool that allows patients to see potential treatment outcomes instantly.

### Integration Architecture

1. **Iframe Embedding** (`/src/pages/SmileSimulatorPage.tsx`)
   - Seamlessly embedded within the site's design
   - Maintains consistent branding and navigation
   - Full-screen responsive experience

2. **User Journey**
   - Accessible via:
     - Main navigation menu
     - Prominent homepage CTA section
     - Services page under Cosmetic Dentistry
   - Clear instructions guide users through the process

3. **Technical Features**
   - **AI Processing**: Advanced algorithms trained on millions of dental cases
   - **Instant Results**: Sub-10 second transformations
   - **HIPAA Compliance**: Secure photo handling and processing
   - **Camera Integration**: Direct photo capture support

4. **Conversion Optimization**
   - Strategic placement after testimonials section
   - Clear call-to-action to book consultation after simulation
   - Tracks user engagement for marketing insights

### Implementation Details

```typescript
// SmileLab integration
<iframe
  src="https://dentalimplantsimulator.netlify.app/"
  title="SmileLab AI Dental Simulator"
  allow="camera"
  style={{
    width: '100%',
    height: '800px',
    border: 'none'
  }}
/>
```

## 🚀 Technical Stack

- **Frontend**: React 18 + TypeScript
- **UI Framework**: Material-UI v5
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Build Tool**: Vite
- **Deployment**: Netlify with serverless functions
- **AI Integration**: OpenAI GPT-4 API

## 📊 Architecture Highlights

### Performance Optimizations
- Lazy loading for heavy components
- Viewport-based animations
- Optimized image delivery
- Code splitting for faster initial loads

### Security Features
- Environment variable protection for API keys
- CORS configuration for API endpoints
- Secure serverless function implementation
- Input sanitization for chatbot

### Responsive Design
- Mobile-first approach
- Adaptive layouts for all screen sizes
- Touch-optimized interactions
- Progressive enhancement

## 🔧 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/BoweryJG/pedro.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your OpenAI API key and other credentials

# Run development server
npm run dev

# Build for production
npm run build
```

## 🌐 Environment Variables

```env
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_CARECREDIT_API_KEY=your_carecredit_key (future)
VITE_LENDING_CLUB_API_KEY=your_lending_club_key (future)
```

## 🚦 Deployment

The site is configured for automatic deployment via Netlify:
- Push to main branch triggers deployment
- Serverless functions handle API calls
- Environment variables managed via Netlify dashboard

## 📈 Future Enhancements

1. **Real-time Financing Approvals**
   - Direct integration with CareCredit API
   - Instant approval decisions
   - Multiple financing options

2. **Advanced Analytics**
   - Conversation success tracking
   - Smile simulator usage metrics
   - Conversion funnel optimization

3. **Enhanced AI Features**
   - Voice interaction capabilities
   - Multi-language support
   - Predictive appointment scheduling

## 👥 Contributing

This is a private repository for Staten Island Advanced Dentistry. For any questions or issues, please contact the development team.

## 📄 License

Proprietary - All rights reserved by Staten Island Advanced Dentistry.