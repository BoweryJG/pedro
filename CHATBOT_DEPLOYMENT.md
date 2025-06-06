# Chatbot Deployment Instructions

## Overview
This AI-powered chatbot system for Dr. Greg Pedro's dental practice uses GPT-4 to educate patients about Yomi dental implants, TMJ treatments, and Emface procedures while guiding them toward booking consultations.

## Setup Instructions

### 1. Environment Variables
Create a `.env` file in the root directory with:
```
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

### 2. OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to your `.env` file

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

## Key Features Implemented

### 1. Socratic Selling Methodology
- Progressive questioning system that guides patients through discovery
- Empathetic responses that build trust
- Natural conversation flow that uncovers pain points

### 2. Procedure Knowledge Base
- **Yomi Implants**: Robotic precision, benefits, pricing
- **TMJ Treatment**: Symptom identification, treatment options
- **Emface**: Non-invasive facial rejuvenation details

### 3. Conversion Optimization
- Real-time booking intent tracking (0-100% score)
- Stage-based conversation management
- Suggested responses to guide conversation
- Integrated booking form with multi-step process

### 4. Analytics System
- Comprehensive event tracking
- Conversion funnel analysis
- Session replay capability
- Lead value calculation

### 5. UI/UX Features
- Floating chat button with smooth animations
- Mobile-responsive design
- Real-time typing indicators
- Stage progress visualization
- Markdown support for rich content

## Production Deployment

### Security Considerations
1. **API Key Protection**: Never expose OpenAI API key in frontend
2. **Backend Proxy**: Create a backend service to handle OpenAI calls
3. **Rate Limiting**: Implement request throttling
4. **Content Filtering**: Add moderation for user inputs

### Backend API Setup (Recommended)
Create a backend endpoint to proxy OpenAI requests:

```javascript
// Example Node.js/Express backend
app.post('/api/chat', async (req, res) => {
  const { message, history } = req.body;
  
  // Validate and sanitize inputs
  // Call OpenAI API
  // Return response
});
```

### Analytics Integration
1. Add Google Analytics:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

2. Update `.env`:
```
VITE_GA_MEASUREMENT_ID=your_ga_id
```

### Performance Optimization
1. Lazy load chatbot component
2. Implement message pagination for long conversations
3. Cache common responses
4. Use WebSocket for real-time updates

## Customization Options

### 1. Personality Adjustment
Edit `src/chatbot/core/openaiService.ts` system prompt

### 2. Question Sets
Modify `src/chatbot/core/socraticQuestions.ts`

### 3. Procedure Information
Update `src/chatbot/knowledge/procedures.ts`

### 4. Booking Flow
Customize `src/chatbot/components/BookingForm.tsx`

### 5. Visual Theme
Adjust colors in `src/chatbot/components/Chatbot.tsx`

## Testing Conversation Flows

### Test Scenarios
1. **Yomi Interest Path**
   - "I'm missing a tooth"
   - Express cost concerns
   - Ask about the robot technology
   - Request appointment

2. **TMJ Discovery Path**
   - "My jaw clicks"
   - Describe daily impact
   - Ask about treatment options
   - Show booking intent

3. **Emface Exploration**
   - "I want to look younger"
   - Express needle fear
   - Ask about results
   - Request consultation

## Monitoring & Optimization

### Key Metrics to Track
- Conversation completion rate
- Average messages per session
- Booking form open rate
- Conversion by procedure type
- Drop-off points in conversation

### A/B Testing Suggestions
- Opening messages
- Question sequences
- Urgency creation tactics
- Suggested response options

## Support & Maintenance

### Regular Updates Needed
1. Refresh local Staten Island references
2. Update pricing information
3. Add new patient testimonials
4. Refine conversation flows based on data

### Troubleshooting
- Check browser console for errors
- Verify API key is valid
- Ensure all dependencies are installed
- Test in incognito mode for clean state

## Contact
For technical support or customization requests, refer to the development team documentation.