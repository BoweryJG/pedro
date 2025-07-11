// Environment configuration for TMJ subdomain
export const environment = {
  practice: {
    name: process.env.NEXT_PUBLIC_PRACTICE_NAME || 'Dr. Pedro\'s TMJ Center',
    phone: process.env.NEXT_PUBLIC_PRACTICE_PHONE || '(xxx) xxx-xxxx',
    phoneNumber: process.env.NEXT_PUBLIC_PRACTICE_PHONE_NUMBER || '+1xxxxxxxxxx',
    email: process.env.NEXT_PUBLIC_PRACTICE_EMAIL || 'info@practice.com',
    address: process.env.NEXT_PUBLIC_PRACTICE_ADDRESS || 'Contact us for address',
  },
  api: {
    backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://backend.onrender.com',
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    facebookAppId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID,
  },
  features: {
    enableChat: process.env.NEXT_PUBLIC_ENABLE_CHAT === 'true',
    enableAnalytics: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  }
};

// Helper function to get safe practice info
export const getPracticeInfo = () => {
  return {
    ...environment.practice,
    displayPhone: environment.practice.phone,
    callablePhone: environment.practice.phoneNumber,
  };
};