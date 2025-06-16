import express from 'express';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { InstagramDMHandler } from '../services/instagramDMHandler.js';
import { AppointmentBookingService } from '../services/appointmentBooking.js';

const router = express.Router();

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Initialize Instagram DM Handler and Appointment Service
const dmHandler = new InstagramDMHandler(supabase);
const appointmentService = new AppointmentBookingService(supabase);

// Verify webhook signature
const verifySignature = (req, res, next) => {
  const signature = req.headers['x-hub-signature-256'];
  const expectedSignature = crypto
    .createHmac('sha256', process.env.FACEBOOK_APP_SECRET)
    .update(req.body, 'utf8')
    .digest('hex');

  if (signature !== `sha256=${expectedSignature}`) {
    console.error('❌ Invalid webhook signature');
    return res.status(403).json({ error: 'Invalid signature' });
  }

  next();
};

// Webhook verification endpoint (for Facebook app setup)
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('🔍 Webhook verification attempt:', { mode, token, challenge });

  // Facebook expects these exact parameters
  if (mode === 'subscribe' && token === (process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN || 'pedro_dental_2025')) {
    console.log('✅ Webhook verified successfully');
    // IMPORTANT: Facebook expects ONLY the challenge value, not JSON
    res.status(200).send(challenge);
  } else {
    console.error('❌ Webhook verification failed');
    console.error('Expected token:', process.env.FACEBOOK_WEBHOOK_VERIFY_TOKEN || 'pedro_dental_2025');
    console.error('Received token:', token);
    res.status(403).send('Verification failed');
  }
});

// Main webhook endpoint for receiving Instagram messages
router.post('/webhook', express.raw({ type: 'application/json' }), verifySignature, async (req, res) => {
  try {
    const body = JSON.parse(req.body);
    console.log('📨 Received webhook:', JSON.stringify(body, null, 2));

    // Process each entry in the webhook
    for (const entry of body.entry || []) {
      // Handle Instagram messaging events
      if (entry.messaging) {
        for (const messagingEvent of entry.messaging) {
          await dmHandler.handleIncomingMessage(messagingEvent);
        }
      }

      // Handle Instagram comments (future feature)
      if (entry.changes) {
        for (const change of entry.changes) {
          if (change.field === 'comments') {
            console.log('💬 Instagram comment received:', change.value);
            // TODO: Handle Instagram comments
          }
        }
      }
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('❌ Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Manual test endpoint (for development)
router.post('/test-message', async (req, res) => {
  try {
    const { message, senderId, recipientId } = req.body;

    // Create a mock Instagram messaging event
    const mockEvent = {
      sender: { id: senderId || 'test_patient_123' },
      recipient: { id: recipientId || process.env.INSTAGRAM_PAGE_ID },
      timestamp: Date.now(),
      message: {
        mid: `test_${Date.now()}`,
        text: message || 'Hello, I need to schedule an appointment'
      }
    };

    console.log('🧪 Processing test message:', mockEvent);
    await dmHandler.handleIncomingMessage(mockEvent);

    res.json({ 
      success: true, 
      message: 'Test message processed',
      event: mockEvent 
    });
  } catch (error) {
    console.error('❌ Test message error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get conversation history (for dashboard)
router.get('/conversations', async (req, res) => {
  try {
    const { practice_id } = req.query;
    
    const { data: conversations, error } = await supabase
      .from('instagram_conversations')
      .select(`
        *,
        instagram_messages (
          id,
          sender_type,
          message_text,
          created_at
        )
      `)
      .eq('practice_id', practice_id)
      .order('last_message_at', { ascending: false });

    if (error) throw error;

    res.json({ conversations });
  } catch (error) {
    console.error('❌ Error fetching conversations:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get conversation by ID
router.get('/conversations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data: conversation, error } = await supabase
      .from('instagram_conversations')
      .select(`
        *,
        instagram_messages (
          id,
          sender_type,
          sender_id,
          message_text,
          message_type,
          attachments,
          is_ai_generated,
          ai_confidence_score,
          created_at
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;

    res.json({ conversation });
  } catch (error) {
    console.error('❌ Error fetching conversation:', error);
    res.status(500).json({ error: error.message });
  }
});

// Send manual response to conversation
router.post('/conversations/:id/reply', async (req, res) => {
  try {
    const { id } = req.params;
    const { message, senderId } = req.body;

    // Get conversation details
    const { data: conversation, error: fetchError } = await supabase
      .from('instagram_conversations')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Send message via Facebook API
    const response = await dmHandler.sendMessage(
      conversation.patient_instagram_id,
      message,
      false // not AI generated
    );

    // Save message to database
    const { error: saveError } = await supabase
      .from('instagram_messages')
      .insert({
        conversation_id: id,
        instagram_message_id: response.message_id || `manual_${Date.now()}`,
        sender_type: 'practice',
        sender_id: senderId || 'practice_user',
        message_text: message,
        is_ai_generated: false
      });

    if (saveError) throw saveError;

    res.json({ success: true, messageId: response.message_id });
  } catch (error) {
    console.error('❌ Error sending manual reply:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get DM analytics
router.get('/analytics', async (req, res) => {
  try {
    const { practice_id, start_date, end_date } = req.query;
    
    const { data: analytics, error } = await supabase
      .from('dm_analytics')
      .select('*')
      .eq('practice_id', practice_id)
      .gte('date', start_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .lte('date', end_date || new Date().toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (error) throw error;

    // Calculate totals
    const totals = analytics.reduce((acc, day) => ({
      total_messages: acc.total_messages + day.total_messages_received,
      ai_responses: acc.ai_responses + day.ai_responses_sent,
      human_interventions: acc.human_interventions + day.human_interventions,
      appointments_booked: acc.appointments_booked + day.appointments_booked,
      avg_response_time: acc.avg_response_time + day.response_time_avg_minutes,
      avg_satisfaction: acc.avg_satisfaction + day.patient_satisfaction_score
    }), {
      total_messages: 0,
      ai_responses: 0,
      human_interventions: 0,
      appointments_booked: 0,
      avg_response_time: 0,
      avg_satisfaction: 0
    });

    // Calculate averages
    const days = analytics.length || 1;
    totals.avg_response_time = (totals.avg_response_time / days).toFixed(2);
    totals.avg_satisfaction = (totals.avg_satisfaction / days).toFixed(2);

    res.json({ 
      analytics,
      totals,
      period: {
        start: start_date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end: end_date || new Date().toISOString().split('T')[0],
        days
      }
    });
  } catch (error) {
    console.error('❌ Error fetching analytics:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get appointment requests for practice dashboard
router.get('/appointments', async (req, res) => {
  try {
    const { practice_id, status } = req.query;
    
    const appointments = await appointmentService.getAppointmentRequests(practice_id, status);
    
    res.json({ appointments });
  } catch (error) {
    console.error('❌ Error fetching appointments:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get available appointment slots
router.get('/appointments/slots', async (req, res) => {
  try {
    const { date, service_type } = req.query;
    
    const slots = await appointmentService.getAvailableSlots(date, service_type);
    
    res.json({ slots });
  } catch (error) {
    console.error('❌ Error fetching appointment slots:', error);
    res.status(500).json({ error: error.message });
  }
});

// Book appointment
router.post('/appointments/:id/book', async (req, res) => {
  try {
    const { id } = req.params;
    const { selectedSlot, contactInfo } = req.body;
    
    const result = await appointmentService.bookAppointment(id, selectedSlot, contactInfo);
    
    res.json(result);
  } catch (error) {
    console.error('❌ Error booking appointment:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update appointment status
router.patch('/appointments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const { data, error } = await supabase
      .from('appointment_requests')
      .update({ status, notes })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    
    res.json({ appointment: data });
  } catch (error) {
    console.error('❌ Error updating appointment:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;