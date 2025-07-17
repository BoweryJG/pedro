const EMAIL_TEMPLATES = {
  // Welcome email for new inquiries
  welcome: {
    subject: 'Welcome to Dr. Greg Pedro - Dr. Greg Pedro',
    template: `
Dear {{name}},

Thank you for reaching out to Dr. Greg Pedro! We're thrilled to hear from you and excited to help you achieve your best smile.

Dr. Greg Pedro and our team are committed to providing you with exceptional dental care using the latest technology, including:
• Yomi Robotic Surgery - Staten Island's only certified practice
• Advanced TMJ Treatment
• EMFACE Rejuvenation

What happens next:
1. Our team will review your inquiry within 24 hours
2. We'll reach out to schedule your consultation
3. You'll receive a personalized treatment plan

In the meantime, feel free to:
• Chat with Sophie, our AI assistant: Visit our website
• Call us directly: (929) 242-4535
• Browse our services: www.drpedrodental.com

We look forward to welcoming you to our practice!

Warm regards,
The Team at Dr. Greg Pedro

P.S. Did you know we offer flexible financing options? Ask about our payment plans during your consultation.
    `
  },

  // Appointment confirmation
  appointmentConfirmation: {
    subject: 'Appointment Confirmed - Dr. Greg Pedro',
    template: `
Dear {{name}},

Great news! Your appointment is confirmed:

📅 Date: {{date}}
⏰ Time: {{time}}
📍 Location: 123 Advanced Dental Plaza, Staten Island, NY 10301
👨‍⚕️ Provider: Dr. Greg Pedro

What to bring:
• Photo ID
• Insurance card (if applicable)
• List of current medications
• Any recent dental X-rays

Parking: Free parking available on-site

Need to reschedule? Call us at (929) 242-4535 or reply to this email.

We're looking forward to seeing you!

Best regards,
Dr. Greg Pedro
    `
  },

  // Insurance inquiry response
  insuranceInquiry: {
    subject: 'Insurance Information - Dr. Greg Pedro',
    template: `
Dear {{name}},

Thank you for your insurance inquiry. We're happy to help you understand your dental benefits!

We accept most major insurance plans and will:
✓ Verify your benefits before treatment
✓ Submit claims on your behalf
✓ Provide detailed treatment estimates
✓ Maximize your insurance benefits

Don't have insurance? No problem! We offer:
• Cherry Financing - Instant approval
• Sunbit Payment Plans - 0% interest options
• In-house payment plans
• Special cash discounts

Next steps:
1. Send us your insurance information: insurance@gregpedromd.com
2. We'll verify your coverage within 48 hours
3. Schedule your consultation with confidence

Questions? Chat with Sophie on our website or call (929) 242-4535.

Best regards,
Insurance Team
Dr. Greg Pedro
    `
  },

  // Emergency response
  emergencyResponse: {
    subject: 'URGENT: Dental Emergency Support - Dr. Pedro',
    template: `
Dear {{name}},

We understand you're experiencing a dental emergency. Your comfort and health are our top priorities.

IMMEDIATE HELP:
📞 Call now: (929) 242-4535
📍 Emergency hours available

While you wait:
• For pain: Take ibuprofen as directed
• For swelling: Apply cold compress
• For bleeding: Apply gentle pressure with gauze
• For knocked-out tooth: Keep moist in milk

Dr. Pedro reserves time daily for emergency patients. We'll do everything possible to see you today.

If you can't reach us immediately:
• Visit the nearest emergency room for severe pain/swelling
• Call back first thing in the morning

Your health is important to us. Don't delay treatment.

Urgently,
Dr. Greg Pedro and Team
    `
  },

  // Follow-up after consultation
  consultationFollowUp: {
    subject: 'Your Personalized Treatment Plan - Dr. Pedro',
    template: `
Dear {{name}},

Thank you for visiting Dr. Greg Pedro! It was wonderful meeting you and discussing your smile goals.

As promised, here's a summary of our discussion:
{{treatmentSummary}}

Your investment options:
{{financingOptions}}

Why patients choose Dr. Pedro:
• Only Yomi-certified dentist in Staten Island
• 500+ successful procedures
• 98% patient satisfaction rate
• State-of-the-art technology

Ready to move forward? Here's how:
1. Reply to this email with any questions
2. Call (929) 242-4535 to schedule treatment
3. Visit our website to learn more

Remember: Many patients tell us they wish they'd started sooner. Don't let another day pass without the smile you deserve!

Looking forward to your transformation,
Dr. Greg Pedro
    `
  },

  // Referral thank you
  referralThankYou: {
    subject: 'Thank You for Your Referral! - Dr. Pedro',
    template: `
Dear {{name}},

We're incredibly grateful for your referral of {{referredName}} to our practice!

Your trust means the world to us. As a thank you:
• You'll receive a $50 credit on your account
• {{referredName}} will receive a new patient discount
• Both of you are entered to win our quarterly smile makeover

Your referrals help our practice grow and allow us to continue investing in the latest technology for all our patients.

Keep the referrals coming! There's no limit to the credits you can earn.

With gratitude,
Dr. Greg Pedro and Team

P.S. Know someone else who could benefit from our care? Send them to newpatients@gregpedromd.com
    `
  },

  // Billing inquiry
  billingInquiry: {
    subject: 'Billing Information - Dr. Greg Pedro',
    template: `
Dear {{name}},

Thank you for your billing inquiry. We're here to make your dental care as affordable as possible.

Your current balance: {{balance}}
Payment options available:
• Online: Visit our patient portal
• Phone: Call (929) 242-4535
• Mail: Send to our office address
• In-person: During your next visit

Need payment assistance?
• Cherry Financing: Apply in 60 seconds
• Sunbit: 0% interest for qualified patients
• Payment plans: Customized to your budget

Questions about your statement? Our billing team is available:
📧 billing@gregpedromd.com
📞 (929) 242-4535

We appreciate your prompt attention to your account.

Best regards,
Billing Department
Dr. Greg Pedro
    `
  },

  // Marketing newsletter
  monthlyNewsletter: {
    subject: 'Your Monthly Smile Update - Dr. Pedro',
    template: `
Dear {{name}},

Happy {{month}} from Dr. Greg Pedro!

This month's highlights:
🦷 Featured Procedure: {{featuredProcedure}}
💰 Special Offer: {{monthlyOffer}}
⭐ Patient Spotlight: {{patientStory}}

Did you know?
{{educationalContent}}

Upcoming events:
• Free Smile Consultation Days
• Yomi Robot Demonstrations
• TMJ Awareness Workshop

Book your next appointment:
• Chat with Sophie: Available 24/7
• Call: (929) 242-4535
• Email: appointments@gregpedromd.com

Thank you for being part of our dental family!

Smiling with you,
Dr. Greg Pedro and Team

*To unsubscribe, reply with "UNSUBSCRIBE"
    `
  }
};

// Email sender function
const sendEmail = async (templateName, recipientEmail, variables = {}) => {
  const template = EMAIL_TEMPLATES[templateName];
  if (!template) {
    throw new Error(`Template ${templateName} not found`);
  }

  // Replace variables in template
  let body = template.template;
  let subject = template.subject;

  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    body = body.replace(regex, variables[key]);
    subject = subject.replace(regex, variables[key]);
  });

  // Here you would integrate with your email service (SendGrid, AWS SES, etc.)
  console.log('Sending email:', {
    to: recipientEmail,
    subject,
    body,
    from: 'noreply@gregpedromd.com'
  });

  return { success: true, messageId: Date.now() };
};

export { EMAIL_TEMPLATES, sendEmail };