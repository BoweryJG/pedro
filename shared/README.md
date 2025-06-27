# 🔗 Shared Components & Cross-Domain Integration

> **Comprehensive documentation for shared components, cross-domain routing, and unified user experience across the Dr. Pedro subdomain ecosystem.**

## 📋 Table of Contents

- [🎯 Shared Components Overview](#-shared-components-overview)
- [🧭 Subdomain Router System](#-subdomain-router-system)
- [🔄 Cross-Domain Navigation](#-cross-domain-navigation)
- [🎨 Unified Theme System](#-unified-theme-system)
- [🔧 Shared Utilities](#-shared-utilities)
- [📱 Responsive Design](#-responsive-design)
- [🚀 Integration Guide](#-integration-guide)
- [📊 Analytics Integration](#-analytics-integration)
- [🔐 Security Considerations](#-security-considerations)
- [🧪 Testing Shared Components](#-testing-shared-components)

---

## 🎯 Shared Components Overview

### **Architecture Purpose**
The shared components system provides unified functionality across all Dr. Pedro subdomains while maintaining service-specific customization and branding.

### **Component Categories**
```typescript
interface SharedComponentCategories {
  navigation: 'Cross-domain routing and subdomain discovery';
  ui_components: 'Reusable interface elements';
  utilities: 'Common functionality and helpers';
  theme_system: 'Unified design tokens and styling';
  analytics: 'Cross-domain tracking and measurement';
  types: 'TypeScript definitions and interfaces';
}
```

### **Component Structure**
```
shared/
├── navigation/              # Cross-domain routing components
│   ├── SubdomainRouter.tsx  # Intelligent service routing
│   ├── CrossDomainNav.tsx   # Unified navigation header
│   └── ServiceMenu.tsx      # Service discovery component
├── components/              # Reusable UI components
│   ├── ChatbotBase.tsx      # Base chatbot functionality
│   ├── ContactWidget.tsx    # Unified contact component
│   ├── ServiceCard.tsx      # Service presentation card
│   └── TestimonialCarousel.tsx  # Patient testimonials
├── utilities/               # Common helper functions
│   ├── analytics.ts         # Cross-domain analytics
│   ├── apiClient.ts         # Unified API client
│   ├── dateUtils.ts         # Date formatting utilities
│   └── validationRules.ts   # Form validation
├── theme/                   # Design system
│   ├── baseTheme.ts         # Core design tokens
│   ├── colorPalettes.ts     # Service-specific colors
│   └── typography.ts        # Unified typography system
└── types/                   # TypeScript definitions
    ├── api.ts               # API response types
    ├── content.ts           # Content structure types
    └── subdomain.ts         # Subdomain-specific types
```

---

## 🧭 Subdomain Router System

### **Intelligent Service Routing**
The [`SubdomainRouter.tsx`](navigation/SubdomainRouter.tsx) component provides AI-powered patient intent analysis and automatic service recommendations.

```typescript
interface SubdomainRouterFeatures {
  intent_analysis: 'AI-powered patient need detection';
  keyword_matching: 'Service-specific keyword recognition';
  recommendation_engine: 'Smart subdomain suggestions';
  analytics_tracking: 'Route recommendation performance';
  fallback_handling: 'Graceful error handling';
}
```

### **Intent Analysis Algorithm**
```typescript
// Patient intent classification
const analyzePatientIntent = async (query: string): Promise<RouteRecommendation> => {
  const keywordMatches = analyzeKeywords(query);
  const aiAnalysis = await getAIClassification(query);
  
  return {
    recommended_subdomain: getBestMatch(keywordMatches, aiAnalysis),
    confidence: calculateConfidence(keywordMatches, aiAnalysis),
    alternative_services: getAlternativeMatches(query),
    reasoning: generateExplanation(keywordMatches, aiAnalysis)
  };
};

// Service keyword mapping
const SERVICE_KEYWORDS = {
  tmj: ['jaw pain', 'clicking', 'grinding', 'headache', 'tmj'],
  implants: ['missing tooth', 'implant', 'dentures', 'replacement'],
  robotic: ['yomi', 'robotic', 'precision', 'computer guided'],
  medspa: ['botox', 'filler', 'wrinkles', 'aesthetics'],
  aboutface: ['emface', 'facial toning', 'muscle stimulation']
};
```

### **Router Implementation**
```typescript
interface RouteRecommendation {
  subdomain: string;
  service: string;
  confidence: number;
  reasoning: string;
}

export const SubdomainRouter: React.FC<SubdomainRouterProps> = ({
  patientIntent,
  onRouteRecommendation
}) => {
  const [recommendation, setRecommendation] = useState<RouteRecommendation | null>(null);
  
  useEffect(() => {
    if (patientIntent) {
      analyzePatientIntent(patientIntent)
        .then(setRecommendation)
        .then(result => onRouteRecommendation?.(result));
    }
  }, [patientIntent]);
  
  if (recommendation && recommendation.confidence > 0.7) {
    return (
      <RecommendationAlert 
        recommendation={recommendation}
        onAccept={() => navigateToSubdomain(recommendation.subdomain)}
        onDecline={() => setRecommendation(null)}
      />
    );
  }
  
  return null;
};
```

---

## 🔄 Cross-Domain Navigation

### **Unified Navigation System**
```typescript
interface CrossDomainNavigation {
  main_navigation: 'Primary service menu';
  breadcrumb_system: 'Cross-domain breadcrumbs';
  quick_links: 'Fast access to popular services';
  search_integration: 'Global search with subdomain routing';
  mobile_optimization: 'Touch-friendly navigation';
}
```

### **Navigation Component Structure**
```typescript
// CrossDomainNav.tsx
export const CrossDomainNav: React.FC<CrossDomainNavProps> = ({
  currentSubdomain,
  userPreferences,
  searchEnabled = true
}) => {
  const services = [
    { name: 'TMJ Treatment', subdomain: 'tmj', icon: '🦷' },
    { name: 'Dental Implants', subdomain: 'implants', icon: '🔧' },
    { name: 'Robotic Surgery', subdomain: 'robotic', icon: '🤖' },
    { name: 'MedSpa Services', subdomain: 'medspa', icon: '💆' },
    { name: 'EMFACE Treatments', subdomain: 'aboutface', icon: '✨' }
  ];
  
  return (
    <NavigationContainer>
      <MainLogo />
      <ServiceMenu services={services} current={currentSubdomain} />
      {searchEnabled && <GlobalSearch onResult={handleSearchResult} />}
      <ContactQuickAccess />
    </NavigationContainer>
  );
};
```

### **Service Discovery Menu**
```typescript
// ServiceMenu.tsx
interface ServiceMenuProps {
  services: Service[];
  layout: 'horizontal' | 'vertical' | 'dropdown';
  showDescriptions?: boolean;
}

export const ServiceMenu: React.FC<ServiceMenuProps> = ({
  services,
  layout = 'horizontal',
  showDescriptions = false
}) => {
  const [hoveredService, setHoveredService] = useState<string | null>(null);
  
  return (
    <Menu layout={layout}>
      {services.map(service => (
        <ServiceMenuItem
          key={service.subdomain}
          service={service}
          isActive={service.subdomain === currentSubdomain}
          onHover={() => setHoveredService(service.subdomain)}
          onClick={() => navigateToService(service.subdomain)}
          showDescription={showDescriptions && hoveredService === service.subdomain}
        />
      ))}
    </Menu>
  );
};
```

---

## 🎨 Unified Theme System

### **Base Design Tokens**
```typescript
// shared/theme/baseTheme.ts
export const baseDesignTokens = {
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem', 
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  
  breakpoints: {
    mobile: '320px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px'
  },
  
  shadows: {
    light: '0 2px 4px rgba(0,0,0,0.1)',
    medium: '0 4px 8px rgba(0,0,0,0.15)',
    heavy: '0 8px 16px rgba(0,0,0,0.2)'
  },
  
  transitions: {
    fast: '0.15s ease',
    medium: '0.3s ease',
    slow: '0.5s ease'
  }
};
```

### **Service-Specific Color Palettes**
```typescript
// shared/theme/colorPalettes.ts
export const serviceColorPalettes = {
  tmj: {
    primary: '#2C5530',
    secondary: '#8BC34A',
    accent: '#4A7C59'
  },
  
  implants: {
    primary: '#1976D2',
    secondary: '#FFC107',
    accent: '#42A5F5'
  },
  
  robotic: {
    primary: '#00BCD4',
    secondary: '#FF5722',
    accent: '#4DD0E1'
  },
  
  medspa: {
    primary: '#E91E63',
    secondary: '#9C27B0',
    accent: '#F48FB1'
  },
  
  aboutface: {
    primary: '#8E24AA',
    secondary: '#00E676',
    accent: '#BA68C8'
  }
};
```

### **Typography System**
```typescript
// shared/theme/typography.ts
export const unifiedTypography = {
  fontFamilies: {
    primary: '"Open Sans", "Helvetica Neue", Arial, sans-serif',
    heading: '"Playfair Display", Georgia, serif',
    monospace: '"Roboto Mono", "Courier New", monospace'
  },
  
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '2rem',
    '4xl': '2.5rem'
  },
  
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  }
};
```

---

## 🔧 Shared Utilities

### **API Client**
```typescript
// shared/utilities/apiClient.ts
class UnifiedApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  
  constructor(config: ApiClientConfig) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'X-Client-Version': '1.0.0',
      ...config.headers
    };
  }
  
  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: { ...this.defaultHeaders, ...options.headers },
      ...options
    };
    
    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new ApiError(response.status, response.statusText);
      }
      
      return await response.json();
    } catch (error) {
      this.handleError(error, endpoint);
      throw error;
    }
  }
  
  // Service-specific methods
  async getServiceContent(subdomain: string): Promise<ServiceContent> {
    return this.request(`/content/${subdomain}`);
  }
  
  async submitConsultationRequest(data: ConsultationRequest): Promise<ConsultationResponse> {
    return this.request('/consultations', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }
}

export const apiClient = new UnifiedApiClient({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'X-Source-Subdomain': getCurrentSubdomain()
  }
});
```

### **Analytics Utilities**
```typescript
// shared/utilities/analytics.ts
export class CrossDomainAnalytics {
  private trackingId: string;
  
  constructor(trackingId: string) {
    this.trackingId = trackingId;
  }
  
  trackSubdomainNavigation(from: string, to: string, method: 'recommendation' | 'manual') {
    gtag('event', 'subdomain_navigation', {
      event_category: 'cross_domain',
      event_label: `${from}_to_${to}`,
      custom_parameters: {
        navigation_method: method,
        timestamp: new Date().toISOString()
      }
    });
  }
  
  trackServiceInterest(subdomain: string, service: string, engagement_level: number) {
    gtag('event', 'service_interest', {
      event_category: 'patient_journey',
      event_label: `${subdomain}_${service}`,
      value: engagement_level
    });
  }
  
  trackConversionFunnel(step: string, subdomain: string, data: any) {
    gtag('event', 'conversion_step', {
      event_category: 'patient_conversion',
      event_label: `${subdomain}_${step}`,
      custom_parameters: data
    });
  }
}

export const analytics = new CrossDomainAnalytics(
  import.meta.env.VITE_GA_TRACKING_ID
);
```

### **Form Validation Rules**
```typescript
// shared/utilities/validationRules.ts
export const commonValidationRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address'
    }
  },
  
  phone: {
    required: 'Phone number is required',
    pattern: {
      value: /^[\+]?[1-9][\d]{0,15}$/,
      message: 'Invalid phone number'
    }
  },
  
  name: {
    required: 'Name is required',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters'
    }
  },
  
  medicalHistory: {
    validate: (value: any) => {
      if (!value || Object.keys(value).length === 0) {
        return 'Medical history information is required';
      }
      return true;
    }
  }
};
```

---

## 📱 Responsive Design

### **Responsive Utilities**
```typescript
// shared/utilities/responsive.ts
export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('desktop');
  
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) setBreakpoint('mobile');
      else if (width < 1024) setBreakpoint('tablet');
      else setBreakpoint('desktop');
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop'
  };
};
```

### **Responsive Component Patterns**
```typescript
// Adaptive navigation based on screen size
export const AdaptiveNavigation: React.FC = () => {
  const { isMobile, isTablet } = useResponsive();
  
  if (isMobile) {
    return <MobileNavigationDrawer />;
  }
  
  if (isTablet) {
    return <TabletNavigationTabs />;
  }
  
  return <DesktopNavigationBar />;
};

// Responsive service cards
export const ResponsiveServiceGrid: React.FC<ServiceGridProps> = ({ services }) => {
  const { breakpoint } = useResponsive();
  
  const getColumns = () => {
    switch (breakpoint) {
      case 'mobile': return 1;
      case 'tablet': return 2;
      default: return 3;
    }
  };
  
  return (
    <Grid container spacing={2} columns={getColumns()}>
      {services.map(service => (
        <Grid item key={service.id}>
          <ServiceCard service={service} />
        </Grid>
      ))}
    </Grid>
  );
};
```

---

## 🚀 Integration Guide

### **Adding Shared Components to Subdomains**
```typescript
// In subdomain App.tsx
import { SubdomainRouter, CrossDomainNav } from '../../../shared/navigation';
import { analytics } from '../../../shared/utilities/analytics';

export const SubdomainApp: React.FC = () => {
  const [patientIntent, setPatientIntent] = useState<string>('');
  
  const handleRouteRecommendation = (recommendation: RouteRecommendation) => {
    analytics.trackSubdomainNavigation(
      getCurrentSubdomain(),
      recommendation.subdomain,
      'recommendation'
    );
  };
  
  return (
    <ThemeProvider theme={subdomainTheme}>
      <CrossDomainNav currentSubdomain={getCurrentSubdomain()} />
      
      <SubdomainRouter
        patientIntent={patientIntent}
        onRouteRecommendation={handleRouteRecommendation}
      />
      
      <SubdomainContent />
    </ThemeProvider>
  );
};
```

### **Theme Integration**
```typescript
// Extending base theme for subdomain
import { baseDesignTokens, serviceColorPalettes } from '../../../shared/theme';

export const createSubdomainTheme = (subdomain: keyof typeof serviceColorPalettes) => {
  return createTheme({
    ...baseDesignTokens,
    palette: {
      ...serviceColorPalettes[subdomain],
      // Subdomain-specific overrides
    },
    components: {
      // Custom component styles
    }
  });
};
```

### **API Integration**
```typescript
// Using shared API client in subdomain
import { apiClient } from '../../../shared/utilities/apiClient';

export const useSubdomainData = (subdomain: string) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    apiClient.getServiceContent(subdomain)
      .then(setContent)
      .finally(() => setLoading(false));
  }, [subdomain]);
  
  return { content, loading };
};
```

---

## 📊 Analytics Integration

### **Cross-Domain Tracking Setup**
```typescript
// Unified analytics across all subdomains
export const setupCrossDomainTracking = () => {
  gtag('config', 'GA-MAIN-TRACKING', {
    linker: {
      domains: [
        'drpedro.com',
        'tmj.drpedro.com',
        'implants.drpedro.com',
        'robotic.drpedro.com',
        'medspa.drpedro.com',
        'aboutface.drpedro.com'
      ]
    }
  });
};
```

### **Patient Journey Tracking**
```typescript
interface PatientJourneyEvent {
  subdomain: string;
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export const trackPatientJourney = (event: PatientJourneyEvent) => {
  gtag('event', event.action, {
    event_category: event.category,
    event_label: event.label,
    value: event.value,
    custom_parameters: {
      subdomain: event.subdomain,
      timestamp: new Date().toISOString(),
      ...event.custom_parameters
    }
  });
};
```

---

## 🔐 Security Considerations

### **Cross-Domain Security**
```typescript
// Secure subdomain communication
export const secureSubdomainCommunication = {
  postMessage: (targetDomain: string, message: any) => {
    const allowedDomains = [
      'https://drpedro.com',
      'https://tmj.drpedro.com',
      'https://implants.drpedro.com',
      'https://robotic.drpedro.com',
      'https://medspa.drpedro.com',
      'https://aboutface.drpedro.com'
    ];
    
    if (allowedDomains.includes(targetDomain)) {
      window.parent.postMessage(message, targetDomain);
    }
  },
  
  validateOrigin: (origin: string): boolean => {
    return origin.endsWith('.drpedro.com') || origin === 'https://drpedro.com';
  }
};
```

### **Data Privacy**
```typescript
// HIPAA-compliant data handling
export const dataPrivacyUtils = {
  sanitizePatientData: (data: any) => {
    // Remove or encrypt sensitive information
    const { ssn, dob, medicalHistory, ...publicData } = data;
    return {
      ...publicData,
      hasPrivateData: !!(ssn || dob || medicalHistory)
    };
  },
  
  validateConsent: (consentData: ConsentData): boolean => {
    const requiredConsents = ['privacy_policy', 'data_processing', 'communication'];
    return requiredConsents.every(consent => consentData[consent] === true);
  }
};
```

---

## 🧪 Testing Shared Components

### **Component Testing Strategy**
```typescript
// shared/components/__tests__/SubdomainRouter.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { SubdomainRouter } from '../navigation/SubdomainRouter';

describe('SubdomainRouter', () => {
  test('recommends TMJ subdomain for jaw pain query', async () => {
    const mockOnRecommendation = jest.fn();
    
    render(
      <SubdomainRouter
        patientIntent="I have terrible jaw pain and clicking"
        onRouteRecommendation={mockOnRecommendation}
      />
    );
    
    await waitFor(() => {
      expect(mockOnRecommendation).toHaveBeenCalledWith(
        expect.objectContaining({
          subdomain: 'tmj',
          confidence: expect.any(Number)
        })
      );
    });
  });
  
  test('recommends implants subdomain for missing tooth query', async () => {
    // Similar test for implants
  });
});
```

### **Integration Testing**
```typescript
// Cross-subdomain navigation testing
describe('Cross-Domain Navigation', () => {
  test('maintains patient context across subdomain navigation', async () => {
    // Test patient data persistence
    // Test analytics tracking
    // Test theme consistency
  });
  
  test('handles subdomain routing errors gracefully', async () => {
    // Test fallback mechanisms
    // Test error boundary behavior
  });
});
```

---

## 🎯 Best Practices

### **Component Development Guidelines**
1. **Reusability**: Design components for multiple subdomain contexts
2. **Theming**: Support service-specific customization
3. **Performance**: Lazy load heavy components
4. **Accessibility**: WCAG 2.1 AA compliance
5. **Documentation**: Comprehensive JSDoc comments

### **Integration Guidelines**
1. **Version Management**: Semantic versioning for shared components
2. **Breaking Changes**: Migration guides for major updates
3. **Testing**: Comprehensive test coverage
4. **Performance Monitoring**: Track component impact
5. **Security**: Regular security audits

---

## 📞 Support & Maintenance

### **Component Ownership**
- **Primary Maintainer**: Bowery Creative Agency
- **Component Reviews**: Weekly component health checks
- **Performance Monitoring**: Continuous integration metrics
- **Security Updates**: Monthly security reviews

### **Update Process**
1. **Development**: Feature branches for shared component updates
2. **Testing**: Cross-subdomain compatibility testing
3. **Deployment**: Coordinated rollout across all subdomains
4. **Monitoring**: Post-deployment performance tracking

---

*Last Updated: June 27, 2025 | Shared Components v1.0.0*