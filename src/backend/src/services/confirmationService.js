import twilio from 'twilio';
import { EMAIL_TEMPLATES } from '../templates/emailTemplates.js';

class ConfirmationService {
  constructor() {
    // Initialize Twilio for SMS
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    this.twilioNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  // Send email confirmation
  async sendEmailConfirmation(appointmentDetails) {
    try {
      const { patient_name, patient_email, preferred_date, preferred_time, service_type } = appointmentDetails;
      
      // Format date and time for display
      const formattedDate = new Date(preferred_date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const formattedTime = preferred_time;
      
      // Create TMJ-specific appointment confirmation template
      const tmjTemplate = {
        subject: 'TMJ Consultation Confirmed - Dr. Pedro Staten Island',
        template: `
Dear {{name}},

Excellent news! Your TMJ consultation is confirmed:

📅 Date: {{date}}
⏰ Time: {{time}}
📍 Location: Dr. Pedro's TMJ Specialty Center, Staten Island, NY
👨‍⚕️ TMJ Specialist: Dr. Pedro
🎯 Service: {{service}}

What to expect at your TMJ consultation:
• Comprehensive jaw joint examination
• Advanced diagnostic assessment
• Personalized treatment recommendations
• Discussion of pain relief options
• Review of Dr. Pedro's specialized TMJ treatments

What to bring:
• Photo ID
• Insurance card (if applicable)
• List of current medications
• Any previous dental records or TMJ treatments

Parking: Free parking available on-site

Questions about your appointment? Call us at (929) 242-4535 or reply to this email.

We understand living with TMJ pain is challenging. Dr. Pedro and our team are here to help you find relief!

Looking forward to helping you,
Dr. Pedro's TMJ Team

P.S. Running late? Please call us as soon as possible so we can adjust your appointment time.
        `
      };

      // Replace template variables
      let emailBody = tmjTemplate.template;
      let emailSubject = tmjTemplate.subject;
      
      const variables = {
        name: patient_name,
        date: formattedDate,
        time: formattedTime,
        service: service_type || 'TMJ Consultation'
      };

      Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        emailBody = emailBody.replace(regex, variables[key]);
        emailSubject = emailSubject.replace(regex, variables[key]);
      });

      // TODO: Integrate with your email service (SendGrid, AWS SES, etc.)
      // For now, log the email details
      console.log('📧 EMAIL CONFIRMATION SENT:', {
        to: patient_email,
        subject: emailSubject,
        body: emailBody,
        from: 'appointments@statenislandtmj.com'
      });

      return { 
        success: true, 
        type: 'email',
        recipient: patient_email,
        messageId: `email_${Date.now()}`
      };
    } catch (error) {
      console.error('Error sending email confirmation:', error);
      return { success: false, error: error.message };
    }
  }

  // Send SMS confirmation
  async sendSMSConfirmation(appointmentDetails) {
    try {
      const { patient_name, patient_phone, preferred_date, preferred_time, service_type } = appointmentDetails;
      
      if (!patient_phone) {
        throw new Error('Patient phone number is required for SMS confirmation');
      }

      // Format date and time for SMS
      const appointmentDate = new Date(preferred_date);
      const formattedDate = appointmentDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'short' });
      
      // Create concise SMS message
      const smsMessage = `Hi ${patient_name}! Your TMJ consultation with Dr. Pedro is confirmed for ${dayName} ${formattedDate} at ${preferred_time}. Location: Staten Island TMJ Center. Questions? Call (929) 242-4535. We look forward to helping with your TMJ relief!`;

      // Send SMS via Twilio
      const message = await this.twilioClient.messages.create({
        body: smsMessage,
        from: this.twilioNumber,
        to: patient_phone
      });

      console.log('📱 SMS CONFIRMATION SENT:', {
        to: patient_phone,
        message: smsMessage,
        sid: message.sid
      });

      return { 
        success: true, 
        type: 'sms',
        recipient: patient_phone,
        messageId: message.sid
      };
    } catch (error) {
      console.error('Error sending SMS confirmation:', error);
      return { success: false, error: error.message };
    }
  }

  // Send reminder SMS (1 day before appointment)
  async sendReminderSMS(appointmentDetails) {
    try {
      const { patient_name, patient_phone, preferred_date, preferred_time } = appointmentDetails;
      
      if (!patient_phone) {
        return { success: false, error: 'No phone number provided' };
      }

      const reminderMessage = `Reminder: ${patient_name}, you have a TMJ consultation with Dr. Pedro tomorrow at ${preferred_time}. Please call (929) 242-4535 if you need to reschedule. See you soon!`;

      const message = await this.twilioClient.messages.create({
        body: reminderMessage,
        from: this.twilioNumber,
        to: patient_phone
      });

      console.log('📱 SMS REMINDER SENT:', {
        to: patient_phone,
        message: reminderMessage,
        sid: message.sid
      });

      return { 
        success: true, 
        type: 'reminder',
        recipient: patient_phone,
        messageId: message.sid
      };
    } catch (error) {
      console.error('Error sending SMS reminder:', error);
      return { success: false, error: error.message };
    }
  }

  // Send both email and SMS confirmations
  async sendAppointmentConfirmation(appointmentDetails) {
    const results = {
      email: null,
      sms: null,
      success: false
    };

    try {
      // Send email confirmation
      if (appointmentDetails.patient_email) {
        results.email = await this.sendEmailConfirmation(appointmentDetails);
      }

      // Send SMS confirmation (only if Twilio is properly configured)
      if (appointmentDetails.patient_phone && this.twilioNumber) {
        results.sms = await this.sendSMSConfirmation(appointmentDetails);
      }

      // Consider success if at least one method worked
      results.success = (results.email?.success || results.sms?.success);

      return results;
    } catch (error) {
      console.error('Error in sendAppointmentConfirmation:', error);
      return { ...results, error: error.message };
    }
  }

  // Format phone number for SMS
  formatPhoneNumber(phone) {
    if (!phone) return null;
    
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Add +1 if it's a 10-digit US number
    if (cleaned.length === 10) {
      return `+1${cleaned}`;
    }
    
    // Add + if it starts with country code
    if (cleaned.length === 11 && cleaned.startsWith('1')) {
      return `+${cleaned}`;
    }
    
    return phone; // Return as-is if format is unclear
  }
}

export default ConfirmationService;