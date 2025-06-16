/// <reference types="vite/client" />

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

export {};
