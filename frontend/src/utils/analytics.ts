// Analytics utility for tracking user interactions

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}


export const trackEvent = ({
  action,
  category,
  label,
  value
}: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    } catch (error) {
      console.warn('Analytics tracking error:', error);
    }
  } else {
    // Log analytics events in development when gtag is not available
    if (import.meta.env.DEV) {
      console.log('Analytics Event (not sent):', { action, category, label, value });
    }
  }
};

// Predefined tracking functions
export const trackPhoneClick = (source: string) => {
  trackEvent({
    action: 'phone_click',
    category: 'contact',
    label: source,
  });
};

export const trackChatOpen = (source: string) => {
  trackEvent({
    action: 'chat_open',
    category: 'engagement',
    label: source,
  });
};

export const trackChatMessage = (stage: string, messageCount: number) => {
  trackEvent({
    action: 'chat_message',
    category: 'engagement',
    label: stage,
    value: messageCount,
  });
};

export const trackBookingIntent = (score: number) => {
  trackEvent({
    action: 'booking_intent',
    category: 'conversion',
    value: score,
  });
};

export const trackEmailClick = (emailType: string) => {
  trackEvent({
    action: 'email_click',
    category: 'contact',
    label: emailType,
  });
};

export const trackProcedureInterest = (procedure: string) => {
  trackEvent({
    action: 'procedure_interest',
    category: 'engagement',
    label: procedure,
  });
};

export const trackConversion = (type: 'appointment' | 'phone' | 'email') => {
  trackEvent({
    action: 'conversion',
    category: 'goals',
    label: type,
  });
};

// Track chat vs phone choice
export const trackContactMethodChoice = (method: 'chat' | 'phone', context: string) => {
  trackEvent({
    action: 'contact_method_choice',
    category: 'user_preference',
    label: `${method}_from_${context}`,
  });
};