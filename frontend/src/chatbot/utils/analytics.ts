import type { ConversationStage, Analytics } from '../types';

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  timestamp: Date;
}

class ChatbotAnalytics {
  private events: AnalyticsEvent[] = [];
  private sessionId: string;
  private userId: string;
  
  constructor() {
    this.sessionId = this.generateSessionId();
    this.userId = this.getUserId();
  }
  
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private getUserId(): string {
    let userId = localStorage.getItem('chatbot_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('chatbot_user_id', userId);
    }
    return userId;
  }
  
  track(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        userId: this.userId,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent
      },
      timestamp: new Date()
    };
    
    this.events.push(analyticsEvent);
    
    // Send to analytics service (e.g., Google Analytics, Mixpanel, etc.)
    this.sendToAnalyticsService(analyticsEvent);
    
    // Store locally for session replay
    this.storeLocally(analyticsEvent);
  }
  
  private sendToAnalyticsService(event: AnalyticsEvent) {
    // In production, send to your analytics service
    if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
      try {
        (window as any).gtag('event', event.event, event.properties);
      } catch (error) {
        console.warn('Analytics tracking error:', error);
      }
    }
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.log('Analytics Event:', event);
    }
  }
  
  private storeLocally(event: AnalyticsEvent) {
    try {
      const stored = localStorage.getItem('chatbot_analytics') || '[]';
      const events = JSON.parse(stored);
      events.push(event);
      
      // Keep only last 100 events
      if (events.length > 100) {
        events.splice(0, events.length - 100);
      }
      
      localStorage.setItem('chatbot_analytics', JSON.stringify(events));
    } catch (error) {
      console.error('Failed to store analytics locally:', error);
    }
  }
  
  // Conversation-specific tracking methods
  
  trackChatOpened() {
    this.track('chat_opened', {
      source: 'floating_button'
    });
  }
  
  trackChatClosed(duration: number, messagesCount: number) {
    this.track('chat_closed', {
      duration_seconds: Math.round(duration / 1000),
      messages_count: messagesCount
    });
  }
  
  trackMessageSent(message: string, stage: ConversationStage, bookingIntent: number) {
    this.track('message_sent', {
      message_length: message.length,
      stage,
      booking_intent: bookingIntent,
      has_procedure_keyword: this.detectProcedureKeywords(message)
    });
  }
  
  trackStageTransition(fromStage: ConversationStage, toStage: ConversationStage) {
    this.track('stage_transition', {
      from_stage: fromStage,
      to_stage: toStage
    });
  }
  
  trackProcedureInterest(procedure: 'yomi' | 'tmj' | 'emface', interestLevel: number) {
    this.track('procedure_interest', {
      procedure,
      interest_level: interestLevel
    });
  }
  
  trackObjection(objectionType: string) {
    this.track('objection_raised', {
      objection_type: objectionType
    });
  }
  
  trackBookingIntent(intent: number, trigger: string) {
    this.track('booking_intent_change', {
      intent_score: intent,
      trigger
    });
  }
  
  trackBookingFormOpened(procedure: string) {
    this.track('booking_form_opened', {
      procedure,
      stage: 'form_view'
    });
  }
  
  trackBookingFormSubmitted(procedure: string, formData: any) {
    this.track('booking_form_submitted', {
      procedure,
      has_insurance: formData.insurance !== 'none',
      preferred_day: new Date(formData.preferredDate).getDay(),
      lead_value: this.calculateLeadValue(procedure)
    });
  }
  
  trackBookingFormAbandoned(procedure: string, step: number) {
    this.track('booking_form_abandoned', {
      procedure,
      abandoned_at_step: step
    });
  }
  
  trackSuggestedResponseClicked(response: string, stage: ConversationStage) {
    this.track('suggested_response_clicked', {
      response,
      stage
    });
  }
  
  // Analytics calculation methods
  
  private detectProcedureKeywords(message: string): string | null {
    const lower = message.toLowerCase();
    
    if (lower.match(/implant|tooth|teeth|missing/)) return 'yomi';
    if (lower.match(/jaw|tmj|headache|clicking/)) return 'tmj';
    if (lower.match(/facial|rejuvenation|wrinkle|emface/)) return 'emface';
    
    return null;
  }
  
  private calculateLeadValue(procedure: string): number {
    const values = {
      yomi: 5000,
      tmj: 2500,
      emface: 3200
    };
    return values[procedure as keyof typeof values] || 0;
  }
  
  // Session analytics
  
  getSessionAnalytics(): Analytics {
    const events = this.events;
    const messages = events.filter(e => e.event === 'message_sent');
    const firstMessage = messages[0];
    const lastMessage = messages[messages.length - 1];
    
    return {
      conversationId: this.sessionId,
      startTime: firstMessage?.timestamp || new Date(),
      endTime: lastMessage?.timestamp,
      messagesCount: messages.length,
      bookingAttempted: events.some(e => e.event === 'booking_form_opened'),
      bookingCompleted: events.some(e => e.event === 'booking_form_submitted'),
      procedureDiscussed: [...new Set(messages.map(e => 
        e.properties?.has_procedure_keyword
      ).filter(Boolean))],
      objectionCount: events.filter(e => e.event === 'objection_raised').length,
      conversionStage: lastMessage?.properties?.stage || 'greeting'
    };
  }
  
  // Conversion funnel analysis
  
  getConversionFunnel() {
    const stages = ['greeting', 'discovery', 'education', 'objection-handling', 'social-proof', 'commitment', 'booking'];
    const funnel: Record<string, number> = {};
    
    stages.forEach(stage => {
      funnel[stage] = this.events.filter(e => 
        e.event === 'stage_transition' && e.properties?.to_stage === stage
      ).length;
    });
    
    return funnel;
  }
  
  // Export analytics for reporting
  
  exportAnalytics(): string {
    const analytics = {
      session: this.getSessionAnalytics(),
      funnel: this.getConversionFunnel(),
      events: this.events
    };
    
    return JSON.stringify(analytics, null, 2);
  }
}

// Singleton instance
export const analytics = new ChatbotAnalytics();

// React hook for analytics
import { useEffect } from 'react';

export function useChatbotAnalytics() {
  useEffect(() => {
    analytics.trackChatOpened();
    
    return () => {
      const sessionAnalytics = analytics.getSessionAnalytics();
      const duration = sessionAnalytics.endTime 
        ? sessionAnalytics.endTime.getTime() - sessionAnalytics.startTime.getTime()
        : 0;
      
      analytics.trackChatClosed(duration, sessionAnalytics.messagesCount);
    };
  }, []);
  
  return analytics;
}