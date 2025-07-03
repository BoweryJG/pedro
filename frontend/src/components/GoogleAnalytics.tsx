import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (command: string, ...args: any[]) => void;
  }
}

export const GoogleAnalytics = () => {
  useEffect(() => {
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    
    if (!measurementId || measurementId === 'your_google_analytics_id_here') {
      console.log('Google Analytics not configured');
      return;
    }

    // Initialize gtag if not already done
    if (typeof window.gtag === 'undefined') {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
    }

    // Configure GA with measurement ID
    window.gtag('config', measurementId, {
      page_path: window.location.pathname,
    });

    // Update the script tag with actual measurement ID
    const scriptTag = document.querySelector('script[src*="googletagmanager.com/gtag"]');
    if (scriptTag) {
      const currentSrc = scriptTag.getAttribute('src');
      if (currentSrc?.includes('G-PLACEHOLDER')) {
        scriptTag.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${measurementId}`);
      }
    }
  }, []);

  return null;
};