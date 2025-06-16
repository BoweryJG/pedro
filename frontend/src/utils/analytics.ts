// Analytics utility for tracking user interactions

interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      parameters?: {
        event_category?: string;
        event_label?: string;
        value?: number;
        [key: string]: any;
      }
    ) => void;
  }
}

export const trackEvent = ({
  action,
  category,
  label,
  value
}: AnalyticsEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
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