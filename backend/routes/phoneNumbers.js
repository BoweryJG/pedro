import express from 'express';
import PhoneNumberManager from '../services/phoneNumberManager.js';

const router = express.Router();
const phoneManager = new PhoneNumberManager();

// Search available phone numbers - DISABLED
// This functionality has been disabled as per requirements
router.get('/search', async (req, res) => {
  res.status(403).json({ 
    error: 'Phone number searching is disabled. Pedro uses only the designated 929 number.' 
  });
});

// Purchase a phone number - DISABLED
// This functionality has been disabled as per requirements
router.post('/purchase', async (req, res) => {
  res.status(403).json({ 
    error: 'Phone number purchasing is disabled. Pedro uses only the designated 929 number.' 
  });
});

// Get all managed numbers
router.get('/managed', async (req, res) => {
  try {
    const { clientId } = req.query;
    const numbers = await phoneManager.getManagedNumbers(clientId);
    res.json({ numbers });
  } catch (error) {
    console.error('Get managed numbers error:', error);
    res.status(500).json({ error: 'Failed to get managed numbers' });
  }
});

// Update phone number settings
router.put('/:phoneNumber/settings', async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const settings = req.body;
    
    const result = await phoneManager.updateNumberSettings(phoneNumber, settings);
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Release a phone number
router.delete('/:phoneNumber', async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const result = await phoneManager.releaseNumber(phoneNumber);
    res.json(result);
  } catch (error) {
    console.error('Release number error:', error);
    res.status(500).json({ error: 'Failed to release number' });
  }
});

// Get usage statistics
router.get('/:phoneNumber/usage', async (req, res) => {
  try {
    const { phoneNumber } = req.params;
    const { startDate, endDate } = req.query;
    
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start and end dates are required' });
    }
    
    const stats = await phoneManager.getUsageStats(phoneNumber, startDate, endDate);
    res.json({ stats });
  } catch (error) {
    console.error('Get usage error:', error);
    res.status(500).json({ error: 'Failed to get usage statistics' });
  }
});

export default router;