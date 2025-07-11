import express from 'express';
import twilio from 'twilio';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { authenticateFlexible, requirePermission } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';
import { preventSQLInjection, preventNoSQLInjection } from '../middleware/validation.js';

dotenv.config();

const router = express.Router();

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Twilio webhook authentication middleware
const validateTwilioWebhook = (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    // Skip validation in development
    return next();
  }

  const twilioSignature = req.headers['x-twilio-signature'];
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
  
  if (!twilioSignature || !twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN,
    twilioSignature,
    url,
    req.body
  )) {
    return res.status(403).json({ error: 'Invalid signature' });
  }
  
  next();
};

// VoIP.ms webhook authentication (basic IP whitelist)
const validateVoIPWebhook = (req, res, next) => {
  // VoIP.ms doesn't provide webhook signatures, so we can use IP whitelisting
  // You should add VoIP.ms IP addresses to your environment variables
  const allowedIPs = process.env.VOIPMS_ALLOWED_IPS?.split(',') || [];
  const clientIP = req.ip || req.connection.remoteAddress;
  
  if (process.env.NODE_ENV === 'production' && allowedIPs.length > 0) {
    if (!allowedIPs.includes(clientIP)) {
      console.warn(`Rejected VoIP.ms webhook from unauthorized IP: ${clientIP}`);
      return res.status(403).json({ error: 'Unauthorized' });
    }
  }
  
  next();
};

// =========================
// Twilio Webhook Endpoints
// =========================

// Validation for Twilio voice status webhook
const validateTwilioVoiceStatus = [
  body('CallSid').isString().matches(/^CA[0-9a-fA-F]{32}$/),
  body('CallStatus').isString().isIn(['queued', 'ringing', 'in-progress', 'completed', 'busy', 'failed', 'no-answer', 'canceled']),
  body('CallDuration').optional().isNumeric(),
  body('From').optional().isString(),
  body('To').optional().isString(),
  body('Direction').optional().isString().isIn(['inbound', 'outbound-api', 'outbound-dial']),
  body('RecordingUrl').optional().isURL(),
  body('RecordingSid').optional().matches(/^RE[0-9a-fA-F]{32}$/),
  body('TranscriptionText').optional().isString().isLength({ max: 65000 }),
  body('TranscriptionStatus').optional().isString()
];

// Twilio Voice Status Callback - supports both Twilio validation and API key auth
router.post('/twilio/voice/status', validateTwilioWebhook, authenticateFlexible, requirePermission('webhook:receive'), validateTwilioVoiceStatus, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      CallSid,
      CallStatus,
      CallDuration,
      From,
      To,
      Direction,
      RecordingUrl,
      RecordingSid,
      TranscriptionText,
      TranscriptionStatus
    } = req.body;

    console.log(`Twilio call status update: ${CallStatus} for ${CallSid}`);

    // Update call record in database
    const { error } = await supabase
      .from('phone_calls')
      .update({
        status: CallStatus,
        duration: parseInt(CallDuration) || 0,
        recording_url: RecordingUrl,
        recording_sid: RecordingSid,
        transcription_text: TranscriptionText,
        transcription_status: TranscriptionStatus,
        updated_at: new Date().toISOString()
      })
      .eq('call_sid', CallSid);

    if (error) {
      console.error('Error updating call status:', error);
    }

    // Handle completed calls
    if (CallStatus === 'completed' && RecordingUrl) {
      // Trigger post-call processing
      await processCompletedCall(CallSid, RecordingUrl);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Twilio voice status webhook error:', error);
    res.status(500).send('Internal server error');
  }
});

// Validation for Twilio SMS webhook
const validateTwilioSMS = [
  body('MessageSid').isString().matches(/^(SM|MM)[0-9a-fA-F]{32}$/),
  body('From').isString(),
  body('To').isString(),
  body('Body').isString().isLength({ max: 1600 }),
  body('NumMedia').optional().isNumeric(),
  body('MediaUrl0').optional().isURL(),
  body('MediaContentType0').optional().isString()
];

// Twilio SMS Webhook - supports both Twilio validation and API key auth
router.post('/twilio/sms/incoming', validateTwilioWebhook, authenticateFlexible, requirePermission('webhook:receive'), validateTwilioSMS, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      MessageSid,
      From,
      To,
      Body,
      NumMedia,
      MediaUrl0,
      MediaContentType0
    } = req.body;

    console.log(`Incoming SMS from ${From}: ${Body}`);

    // Store SMS in database
    const { data: smsData, error: smsError } = await supabase
      .from('sms_conversations')
      .insert({
        message_sid: MessageSid,
        from_number: From,
        to_number: To,
        message: Body,
        direction: 'inbound',
        status: 'received',
        provider: 'twilio',
        media_url: MediaUrl0,
        media_type: MediaContentType0,
        created_at: new Date().toISOString()
      });

    if (smsError) {
      console.error('Error storing SMS:', smsError);
    }

    // Process auto-response
    const autoResponse = await getAutoResponse(Body, From);
    
    const twiml = new twilio.twiml.MessagingResponse();
    
    if (autoResponse) {
      twiml.message(autoResponse.message);
      
      // Log auto-response
      await supabase
        .from('sms_conversations')
        .insert({
          from_number: To,
          to_number: From,
          message: autoResponse.message,
          direction: 'outbound',
          status: 'sent',
          provider: 'twilio',
          metadata: { auto_response: true, trigger: autoResponse.trigger },
          created_at: new Date().toISOString()
        });
    }

    res.type('text/xml');
    res.send(twiml.toString());
  } catch (error) {
    console.error('Twilio SMS webhook error:', error);
    res.status(500).send('Internal server error');
  }
});

// Validation for Twilio SMS status webhook
const validateTwilioSMSStatus = [
  body('MessageSid').isString().matches(/^(SM|MM)[0-9a-fA-F]{32}$/),
  body('MessageStatus').isString().isIn(['queued', 'sending', 'sent', 'failed', 'delivered', 'undelivered', 'receiving', 'received']),
  body('ErrorCode').optional().isNumeric(),
  body('ErrorMessage').optional().isString()
];

// Twilio SMS Status Callback - supports both Twilio validation and API key auth
router.post('/twilio/sms/status', validateTwilioWebhook, authenticateFlexible, requirePermission('webhook:receive'), validateTwilioSMSStatus, async (req, res) => {
  try {
    const { MessageSid, MessageStatus, ErrorCode, ErrorMessage } = req.body;

    console.log(`SMS status update: ${MessageStatus} for ${MessageSid}`);

    // Update SMS status in database
    const { error } = await supabase
      .from('sms_conversations')
      .update({
        status: MessageStatus,
        error_code: ErrorCode,
        error_message: ErrorMessage,
        updated_at: new Date().toISOString()
      })
      .eq('message_sid', MessageSid);

    if (error) {
      console.error('Error updating SMS status:', error);
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Twilio SMS status webhook error:', error);
    res.status(500).send('Internal server error');
  }
});

// Twilio Recording Status Callback - supports both Twilio validation and API key auth
router.post('/twilio/recording/status', validateTwilioWebhook, authenticateFlexible, requirePermission('webhook:receive'), async (req, res) => {
  try {
    const {
      RecordingSid,
      RecordingUrl,
      RecordingStatus,
      RecordingDuration,
      CallSid
    } = req.body;

    console.log(`Recording status: ${RecordingStatus} for ${RecordingSid}`);

    if (RecordingStatus === 'completed') {
      // Update call record with recording info
      const { error } = await supabase
        .from('phone_calls')
        .update({
          recording_sid: RecordingSid,
          recording_url: RecordingUrl,
          recording_duration: parseInt(RecordingDuration) || 0,
          updated_at: new Date().toISOString()
        })
        .eq('call_sid', CallSid);

      if (error) {
        console.error('Error updating recording info:', error);
      }

      // Trigger transcription if enabled
      if (process.env.ENABLE_TRANSCRIPTION === 'true') {
        await triggerTranscription(CallSid, RecordingUrl);
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Twilio recording webhook error:', error);
    res.status(500).send('Internal server error');
  }
});

// =========================
// VoIP.ms Webhook Endpoints
// =========================

// VoIP.ms SMS Webhook - supports both IP validation and API key auth
router.post('/voipms/sms/incoming', validateVoIPWebhook, authenticateFlexible, requirePermission('webhook:receive'), async (req, res) => {
  try {
    const { from, to, message, id, date } = req.body;

    console.log(`VoIP.ms SMS from ${from}: ${message}`);

    // Store SMS in database
    const { data: smsData, error: smsError } = await supabase
      .from('sms_conversations')
      .insert({
        message_sid: id || `voipms_${Date.now()}`,
        from_number: from,
        to_number: to,
        message: message,
        direction: 'inbound',
        status: 'received',
        provider: 'voipms',
        created_at: date || new Date().toISOString()
      });

    if (smsError) {
      console.error('Error storing VoIP.ms SMS:', smsError);
    }

    // Process auto-response
    const autoResponse = await getAutoResponse(message, from);
    
    if (autoResponse) {
      // Send auto-response via VoIP.ms
      await sendVoIPMSSMS(from, autoResponse.message);
      
      // Log auto-response
      await supabase
        .from('sms_conversations')
        .insert({
          from_number: to,
          to_number: from,
          message: autoResponse.message,
          direction: 'outbound',
          status: 'sent',
          provider: 'voipms',
          metadata: { auto_response: true, trigger: autoResponse.trigger },
          created_at: new Date().toISOString()
        });
    }

    res.json({ status: 'success' });
  } catch (error) {
    console.error('VoIP.ms SMS webhook error:', error);
    res.status(500).json({ error: 'Failed to process SMS' });
  }
});

// VoIP.ms Call Webhook (CDR notification) - supports both IP validation and API key auth
router.post('/voipms/call/cdr', validateVoIPWebhook, authenticateFlexible, requirePermission('webhook:receive'), async (req, res) => {
  try {
    const {
      callid,
      callerid,
      destination,
      description,
      account,
      disposition,
      duration,
      seconds,
      date,
      uniqueid,
      total
    } = req.body;

    console.log(`VoIP.ms CDR for call ${callid}: ${disposition}`);

    // Store call record in database
    const { error } = await supabase
      .from('phone_calls')
      .insert({
        call_sid: uniqueid || callid,
        account_sid: 'voipms',
        from_number: callerid,
        to_number: destination,
        direction: description?.includes('Incoming') ? 'inbound' : 'outbound',
        status: mapVoIPMSStatus(disposition),
        duration: parseInt(seconds) || 0,
        price: parseFloat(total) || 0,
        price_unit: 'USD',
        started_at: date,
        provider: 'voipms',
        metadata: {
          account,
          disposition,
          description
        },
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error storing VoIP.ms CDR:', error);
    }

    res.json({ status: 'success' });
  } catch (error) {
    console.error('VoIP.ms CDR webhook error:', error);
    res.status(500).json({ error: 'Failed to process CDR' });
  }
});

// VoIP.ms Recording Ready Webhook - supports both IP validation and API key auth
router.post('/voipms/recording/ready', validateVoIPWebhook, authenticateFlexible, requirePermission('webhook:receive'), async (req, res) => {
  try {
    const { recording_id, call_id, recording_url, duration } = req.body;

    console.log(`VoIP.ms recording ready for call ${call_id}`);

    // Update call record with recording info
    const { error } = await supabase
      .from('phone_calls')
      .update({
        recording_sid: recording_id,
        recording_url: recording_url,
        recording_duration: parseInt(duration) || 0,
        updated_at: new Date().toISOString()
      })
      .eq('call_sid', call_id);

    if (error) {
      console.error('Error updating VoIP.ms recording:', error);
    }

    // Trigger transcription if enabled
    if (process.env.ENABLE_TRANSCRIPTION === 'true') {
      await triggerTranscription(call_id, recording_url);
    }

    res.json({ status: 'success' });
  } catch (error) {
    console.error('VoIP.ms recording webhook error:', error);
    res.status(500).json({ error: 'Failed to process recording' });
  }
});

// =========================
// Helper Functions
// =========================

// Get auto-response based on message content
async function getAutoResponse(message, fromNumber) {
  const lowerMessage = message.toLowerCase();
  
  // Check for appointment keywords
  if (/appointment|schedule|book|available|availability/.test(lowerMessage)) {
    return {
      trigger: 'appointment',
      message: 'Thank you for your interest in scheduling an appointment! Please visit our website at gregpedromd.com or call us at (954) 456-1627 during business hours. Our team will be happy to assist you.'
    };
  }
  
  // Check for emergency keywords
  if (/emergency|urgent|pain|bleeding|swelling/.test(lowerMessage)) {
    return {
      trigger: 'emergency',
      message: 'For dental emergencies, please call our emergency line at (954) 456-1627. If this is a life-threatening emergency, please call 911 immediately.'
    };
  }
  
  // Check for hours keywords
  if (/hours|open|closed|time|when/.test(lowerMessage)) {
    return {
      trigger: 'hours',
      message: 'Our office hours are Monday-Friday 8:00 AM - 5:00 PM. We are closed on weekends. For appointments, please call (954) 456-1627.'
    };
  }
  
  // Check for location keywords
  if (/location|address|where|directions/.test(lowerMessage)) {
    return {
      trigger: 'location',
      message: 'We are located at 3031 SW 160th Ave, Suite 103 Miramar, FL 33027. Visit gregpedromd.com for detailed directions and parking information.'
    };
  }
  
  // Check for insurance keywords
  if (/insurance|coverage|accept|plan/.test(lowerMessage)) {
    return {
      trigger: 'insurance',
      message: 'We accept most major dental insurance plans. Please call our office at (954) 456-1627 to verify your specific coverage.'
    };
  }
  
  // Default response for unmatched messages
  return {
    trigger: 'default',
    message: 'Thank you for contacting Dr. Pedro\'s office. Our team will respond to your message during business hours. For immediate assistance, please call (954) 456-1627.'
  };
}

// Send SMS via VoIP.ms
async function sendVoIPMSSMS(to, message) {
  try {
    const voipService = await import('../services/voipService.js');
    return await voipService.default.prototype.sendSMS.call({
      username: process.env.VOIPMS_USERNAME,
      password: process.env.VOIPMS_PASSWORD,
      did: process.env.VOIPMS_DID
    }, to, message);
  } catch (error) {
    console.error('Error sending VoIP.ms SMS:', error);
    throw error;
  }
}

// Map VoIP.ms call status to our schema
function mapVoIPMSStatus(disposition) {
  const statusMap = {
    'answered': 'completed',
    'busy': 'busy',
    'noanswer': 'no-answer',
    'cancel': 'canceled',
    'congestion': 'failed',
    'chanunavail': 'failed',
    'failed': 'failed'
  };
  
  return statusMap[disposition?.toLowerCase()] || 'unknown';
}

// Process completed call
async function processCompletedCall(callSid, recordingUrl) {
  try {
    console.log(`Processing completed call ${callSid}`);
    
    // You can add additional processing here such as:
    // - Sending follow-up SMS
    // - Creating tasks for staff
    // - Analyzing call metrics
    // - Updating patient records
    
  } catch (error) {
    console.error('Error processing completed call:', error);
  }
}

// Trigger transcription for a recording
async function triggerTranscription(callSid, recordingUrl) {
  try {
    console.log(`Triggering transcription for call ${callSid}`);
    
    // Import transcription service
    const TranscriptionService = await import('../services/transcriptionService.js');
    const transcriptionService = new TranscriptionService.default();
    
    // Transcribe the recording
    const transcription = await transcriptionService.transcribeFromUrl(recordingUrl);
    
    // Store transcription in database
    const { error } = await supabase
      .from('phone_calls')
      .update({
        transcription_text: transcription.text,
        transcription_status: 'completed',
        metadata: {
          transcription_service: transcription.service,
          transcription_confidence: transcription.confidence
        },
        updated_at: new Date().toISOString()
      })
      .eq('call_sid', callSid);
    
    if (error) {
      console.error('Error storing transcription:', error);
    }
    
  } catch (error) {
    console.error('Error triggering transcription:', error);
  }
}

export default router;