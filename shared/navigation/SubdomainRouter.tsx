import React, { useEffect, useState } from 'react';
import { Box, Alert, CircularProgress, Typography } from '@mui/material';

interface RouteMatch {
  subdomain: string;
  service: string;
  intent: string;
  confidence: number;
}

interface SubdomainRouterProps {
  currentPath?: string;
  patientIntent?: string;
  onRouteRecommendation?: (recommendation: RouteMatch) => void;
}

const SERVICE_MAPPING = {
  // TMJ-related keywords
  tmj: [
    'tmj', 'jaw pain', 'jaw clicking', 'jaw popping', 'lockjaw', 'bruxism', 
    'teeth grinding', 'jaw joint', 'facial pain', 'headache', 'ear pain',
    'jaw muscle', 'temporal mandibular', 'jaw dysfunction'
  ],
  
  // Implant-related keywords
  implants: [
    'dental implant', 'implants', 'missing tooth', 'tooth replacement',
    'implant surgery', 'bone graft', 'crown', 'bridge alternative',
    'permanent teeth', 'tooth loss', 'implant restoration'
  ],
  
  // Robotic surgery keywords
  robotic: [
    'yomi', 'robotic surgery', 'precision surgery', 'computer guided',
    'robotic implant', 'guided surgery', 'digital dentistry',
    'robotic assistance', 'yomi robot', 'precision placement'
  ],
  
  // MedSpa keywords
  medspa: [
    'botox', 'dermal filler', 'facial rejuvenation', 'anti-aging',
    'wrinkle treatment', 'cosmetic injection', 'aesthetic treatment',
    'facial aesthetics', 'lip filler', 'skin treatment'
  ],
  
  // About Face keywords
  aboutface: [
    'emface', 'facial toning', 'non-surgical facelift', 'facial muscle',
    'face tightening', 'facial contouring', 'muscle stimulation',
    'facial enhancement', 'face lift alternative', 'facial sculpting'
  ]
};

export const SubdomainRouter: React.FC<SubdomainRouterProps> = ({
  currentPath = '',
  patientIntent = '',
  onRouteRecommendation
}) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [routeRecommendation, setRouteRecommendation] = useState<RouteMatch | null>(null);
  const [showRecommendation, setShowRecommendation] = useState(false);

  useEffect(() => {
    if (patientIntent) {
      analyzePatientIntent(patientIntent);
    }
  }, [patientIntent]);

  const analyzePatientIntent = async (intent: string) => {
    setIsAnalyzing(true);
    
    try {
      // Analyze intent against service keywords
      const matches = analyzeKeywordMatches(intent.toLowerCase());
      
      // Get AI analysis for more complex intents
      const aiAnalysis = await getAIIntentAnalysis(intent);
      
      // Combine results
      const bestMatch = getBestMatch(matches, aiAnalysis);
      
      if (bestMatch && bestMatch.confidence > 0.6) {
        setRouteRecommendation(bestMatch);
        setShowRecommendation(true);
        
        if (onRouteRecommendation) {
          onRouteRecommendation(bestMatch);
        }
      }
    } catch (error) {
      console.error('Intent analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const analyzeKeywordMatches = (intent: string): RouteMatch[] => {
    const matches: RouteMatch[] = [];
    
    Object.entries(SERVICE_MAPPING).forEach(([service, keywords]) => {
      let matchCount = 0;
      let totalRelevance = 0;
      
      keywords.forEach(keyword => {
        if (intent.includes(keyword)) {
          matchCount++;
          // Weight longer keywords more heavily
          totalRelevance += keyword.length;
        }
      });
      
      if (matchCount > 0) {
        const confidence = Math.min(
          (matchCount / keywords.length) + (totalRelevance / intent.length),
          1.0
        );
        
        matches.push({
          subdomain: service,
          service: getServiceDisplayName(service),
          intent: intent,
          confidence: confidence
        });
      }
    });
    
    return matches.sort((a, b) => b.confidence - a.confidence);
  };

  const getAIIntentAnalysis = async (intent: string): Promise<RouteMatch | null> => {
    try {
      const response = await fetch(`${getBaseApiUrl()}/api/ai/intent-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: intent,
          context: 'dental_service_routing'
        })
      });

      if (response.ok) {
        const result = await response.json();
        return result.routeRecommendation;
      }
    } catch (error) {
      console.warn('AI intent analysis failed:', error);
    }
    
    return null;
  };

  const getBestMatch = (keywordMatches: RouteMatch[], aiMatch: RouteMatch | null): RouteMatch | null => {
    if (!keywordMatches.length && !aiMatch) return null;
    
    if (!aiMatch) return keywordMatches[0];
    if (!keywordMatches.length) return aiMatch;
    
    // Combine keyword and AI analysis
    const topKeywordMatch = keywordMatches[0];
    
    if (topKeywordMatch.subdomain === aiMatch.subdomain) {
      // Both agree - high confidence
      return {
        ...topKeywordMatch,
        confidence: Math.min(topKeywordMatch.confidence + 0.2, 1.0)
      };
    }
    
    // Disagreement - choose higher confidence
    return topKeywordMatch.confidence > aiMatch.confidence ? topKeywordMatch : aiMatch;
  };

  const getServiceDisplayName = (service: string): string => {
    const displayNames = {
      tmj: 'TMJ Treatment',
      implants: 'Dental Implants',
      robotic: 'Yomi Robotic Surgery',
      medspa: 'MedSpa Services',
      aboutface: 'About Face Aesthetics'
    };
    
    return displayNames[service as keyof typeof displayNames] || service;
  };

  const getBaseApiUrl = () => {
    if (window.location.hostname.includes('localhost')) {
      return 'http://localhost:3001';
    }
    return 'https://pedrobackend.onrender.com';
  };

  const getSubdomainUrl = (subdomain: string): string => {
    const baseUrl = window.location.hostname.includes('localhost') 
      ? 'http://localhost:5173'
      : 'https://drpedro.com';
    
    if (subdomain === 'main') return baseUrl;
    return `https://${subdomain}.drpedro.com`;
  };

  const handleAcceptRecommendation = () => {
    if (routeRecommendation) {
      // Track the accepted recommendation
      trackRouteRecommendation(routeRecommendation, 'accepted');
      
      // Navigate to recommended subdomain
      window.location.href = getSubdomainUrl(routeRecommendation.subdomain);
    }
  };

  const handleDeclineRecommendation = () => {
    if (routeRecommendation) {
      trackRouteRecommendation(routeRecommendation, 'declined');
    }
    setShowRecommendation(false);
  };

  const trackRouteRecommendation = async (recommendation: RouteMatch, action: string) => {
    try {
      await fetch(`${getBaseApiUrl()}/api/analytics/route-recommendation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          recommendation,
          action,
          timestamp: new Date().toISOString(),
          currentPath,
          userAgent: navigator.userAgent
        })
      });
    } catch (error) {
      console.warn('Route recommendation tracking failed:', error);
    }
  };

  if (isAnalyzing) {
    return (
      <Box display="flex" alignItems="center" gap={2} p={2}>
        <CircularProgress size={20} />
        <Typography variant="body2">
          Analyzing your needs to find the best service...
        </Typography>
      </Box>
    );
  }

  if (showRecommendation && routeRecommendation) {
    return (
      <Alert
        severity="info"
        action={
          <Box display="flex" gap={1}>
            <Typography
              variant="button"
              sx={{ 
                cursor: 'pointer', 
                color: 'primary.main',
                textDecoration: 'underline'
              }}
              onClick={handleAcceptRecommendation}
            >
              Yes, take me there
            </Typography>
            <Typography
              variant="button"
              sx={{ 
                cursor: 'pointer', 
                color: 'text.secondary',
                ml: 2
              }}
              onClick={handleDeclineRecommendation}
            >
              No thanks
            </Typography>
          </Box>
        }
        sx={{ mb: 2 }}
      >
        <Typography variant="body2">
          Based on your interests, you might want to visit our{' '}
          <strong>{routeRecommendation.service}</strong> section.
        </Typography>
      </Alert>
    );
  }

  return null;
};

export default SubdomainRouter;