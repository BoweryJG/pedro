import React, { useEffect } from 'react';
import { useChatStore } from '../../../chatbot/store/chatStore';
import { trackEvent } from '../../../utils/analytics';

// This component now serves as a context provider for EmFace/AboutFace specific chat interactions
// The actual chat UI is handled by the global Julie chatbot

const AboutFaceChatbot: React.FC = () => {
  // Set up EmFace context when the component mounts
  useEffect(() => {
    // Track that user is on AboutFace subdomain
    trackEvent({
      action: 'subdomain_visit',
      category: 'engagement',
      label: 'aboutface'
    });
  }, []);

  // This component no longer renders its own chat interface
  // Julie handles all chat interactions with EmFace context
  return null;
};

export default AboutFaceChatbot;