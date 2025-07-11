// Central environment configuration
import { initializeEnvironment, getApiConfig, isFeatureEnabled } from '../utils/envValidator.js';

// Initialize and validate environment on import
const config = initializeEnvironment();
const apiConfig = getApiConfig();

// Export validated configuration
export const ENV = {
  // API Configuration
  API_URL: apiConfig.apiUrl,
  
  // Feature Flags
  FEATURES: {
    VOICE_CHAT: isFeatureEnabled('voice'),
    FINANCING: isFeatureEnabled('financing'),
    INSURANCE: isFeatureEnabled('insurance')
  },
  
  // Third-party Services
  SERVICES: {
    GOOGLE_ANALYTICS: apiConfig.gaId,
    SUNBIT: apiConfig.financing.sunbit,
    CHERRY: apiConfig.financing.cherry,
    ZUUB: apiConfig.insurance.zuub,
    PVERIFY: apiConfig.insurance.pverify
  },
  
  // Development/Production flags
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE
};

// Helper function to check if a service is configured
export function isServiceConfigured(service) {
  switch (service) {
    case 'sunbit':
      return !!ENV.SERVICES.SUNBIT;
    case 'cherry':
      return !!ENV.SERVICES.CHERRY;
    case 'zuub':
      return !!ENV.SERVICES.ZUUB;
    case 'pverify':
      return !!ENV.SERVICES.PVERIFY;
    case 'analytics':
      return !!ENV.SERVICES.GOOGLE_ANALYTICS;
    default:
      return false;
  }
}

// Log environment info in development
if (ENV.IS_DEV) {
  console.log('🌍 Environment Configuration:', {
    mode: ENV.MODE,
    apiUrl: ENV.API_URL,
    features: ENV.FEATURES,
    configuredServices: Object.entries(ENV.SERVICES)
      .filter(([_, value]) => !!value)
      .map(([key]) => key.toLowerCase())
  });
}

export default ENV;