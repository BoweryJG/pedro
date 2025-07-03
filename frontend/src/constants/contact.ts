export const CONTACT_INFO = {
  phone: {
    display: '(929) 242-4535',
    raw: '+19292424535',
    href: 'tel:+19292424535',
    legacy: '(718) 494-9700', // Previous number if needed
    note: 'For best service, chat with Julie first - she can connect you with our team instantly!',
  },
  emails: {
    primary: 'drpedro@gregpedromd.com',
    suite: {
      // All department emails forward to drpedro@gregpedromd.com
      info: 'info@gregpedromd.com',
      appointments: 'appointments@gregpedromd.com',
      billing: 'billing@gregpedromd.com',
      insurance: 'insurance@gregpedromd.com',
      referrals: 'referrals@gregpedromd.com',
      emergencies: 'emergencies@gregpedromd.com',
      marketing: 'marketing@gregpedromd.com',
      support: 'support@gregpedromd.com',
      newpatients: 'newpatients@gregpedromd.com',
      feedback: 'feedback@gregpedromd.com',
    },
    forwardingNote: 'All department emails forward to drpedro@gregpedromd.com',
    legacy: [
      'info@drpedrodental.com',
      'info@siadvanceddentistry.com',
    ],
  },
  chat: {
    priority: 1,
    defaultMessage: 'Talk or chat with Julie - our AI assistant who can instantly connect you with our team when needed!',
    availability: '24/7 AI Assistant with Voice & Chat',
    capabilities: [
      'Answer questions about services and pricing',
      'Schedule appointments',
      'Connect you with live team members',
      'Handle emergencies',
      'Process insurance questions'
    ],
  },
  businessHours: {
    weekdays: '9:00 AM - 6:00 PM',
    saturday: '9:00 AM - 2:00 PM',
    sunday: 'Closed',
  },
  emergencyNote: 'For dental emergencies, please call directly',
  address: {
    street: '4300 Hylan Blvd',
    city: 'Staten Island',
    state: 'NY',
    zip: '10312',
    full: '4300 Hylan Blvd, Staten Island, NY 10312',
  },
};