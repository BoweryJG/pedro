import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Save as SaveIcon,
  Science as TestIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useSupabase } from '../../hooks/useSupabase';

interface VoiceSettings {
  enabled: boolean;
  twilioPhoneNumber: string;
  voiceModel: string;
  voiceSpeed: number;
  voicePitch: number;
  personality: string;
  greetingMessage: string;
  llmModel: string;
  enableAppointments: boolean;
  enableEmergencyDetection: boolean;
  maxCallDuration: number;
  recordCalls: boolean;
}

const VoiceAISettings: React.FC = () => {
  const { supabase } = useSupabase();
  const [settings, setSettings] = useState<VoiceSettings>({
    enabled: true,
    twilioPhoneNumber: '+19292424535',
    voiceModel: 'aura-2-thalia-en',
    voiceSpeed: 0.95,
    voicePitch: 1.05,
    personality: 'professional',
    greetingMessage: "Thank you for calling Dr. Pedro's office. This is Julie. How can I help you today?",
    llmModel: 'gpt-4o-mini',
    enableAppointments: true,
    enableEmergencyDetection: true,
    maxCallDuration: 600, // 10 minutes
    recordCalls: true,
  });

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKey, setApiKey] = useState('••••••••••••••••••••');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('category', 'voice_ai')
        .single();

      if (error && error.code === '42P01') {
        // Table doesn't exist yet
        console.log('Settings table not created yet');
      } else if (data) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      // Don't crash, just use defaults
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaveStatus('saving');
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          category: 'voice_ai',
          settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
    }
  };

  const testConnection = async () => {
    setTestStatus('testing');
    try {
      const response = await fetch('/api/voice/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: settings.twilioPhoneNumber }),
      });

      if (response.ok) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
      }
    } catch (error) {
      console.error('Test failed:', error);
      setTestStatus('error');
    } finally {
      setTimeout(() => setTestStatus('idle'), 5000);
    }
  };

  const handleChange = (field: keyof VoiceSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <SettingsIcon /> Voice AI Configuration
      </Typography>

      <Grid container spacing={3}>
        {/* Main Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                General Settings
              </Typography>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enabled}
                    onChange={(e) => handleChange('enabled', e.target.checked)}
                  />
                }
                label="Enable Voice AI"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Phone Number"
                value={settings.twilioPhoneNumber}
                onChange={(e) => handleChange('twilioPhoneNumber', e.target.value)}
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1 }} />,
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="API Key"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowApiKey(!showApiKey)}>
                        {showApiKey ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>LLM Model</InputLabel>
                <Select
                  value={settings.llmModel}
                  onChange={(e) => handleChange('llmModel', e.target.value)}
                  label="LLM Model"
                >
                  <MenuItem value="gpt-4o">GPT-4 Omni (Best)</MenuItem>
                  <MenuItem value="gpt-4o-mini">GPT-4 Omni Mini (Fast)</MenuItem>
                  <MenuItem value="claude-3-opus">Claude 3 Opus</MenuItem>
                  <MenuItem value="claude-3-sonnet">Claude 3 Sonnet</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Max Call Duration (seconds)"
                type="number"
                value={settings.maxCallDuration}
                onChange={(e) => handleChange('maxCallDuration', parseInt(e.target.value))}
                sx={{ mb: 2 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.recordCalls}
                    onChange={(e) => handleChange('recordCalls', e.target.checked)}
                  />
                }
                label="Record Calls"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Voice Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Voice Configuration
              </Typography>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Voice Model</InputLabel>
                <Select
                  value={settings.voiceModel}
                  onChange={(e) => handleChange('voiceModel', e.target.value)}
                  label="Voice Model"
                >
                  <MenuItem value="aura-2-thalia-en">Thalia (Female, Warm)</MenuItem>
                  <MenuItem value="aura-2-orion-en">Orion (Male, Professional)</MenuItem>
                  <MenuItem value="aura-2-luna-en">Luna (Female, Friendly)</MenuItem>
                  <MenuItem value="aura-2-stella-en">Stella (Female, Clear)</MenuItem>
                </Select>
              </FormControl>

              <Typography gutterBottom>Voice Speed: {settings.voiceSpeed}x</Typography>
              <Box sx={{ px: 2, mb: 2 }}>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={settings.voiceSpeed}
                  onChange={(e) => handleChange('voiceSpeed', parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </Box>

              <Typography gutterBottom>Voice Pitch: {settings.voicePitch}x</Typography>
              <Box sx={{ px: 2, mb: 2 }}>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={settings.voicePitch}
                  onChange={(e) => handleChange('voicePitch', parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Personality</InputLabel>
                <Select
                  value={settings.personality}
                  onChange={(e) => handleChange('personality', e.target.value)}
                  label="Personality"
                >
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="friendly">Friendly</MenuItem>
                  <MenuItem value="warm">Warm & Caring</MenuItem>
                  <MenuItem value="efficient">Efficient & Direct</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Conversation Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Conversation Settings
              </Typography>

              <TextField
                fullWidth
                label="Greeting Message"
                multiline
                rows={3}
                value={settings.greetingMessage}
                onChange={(e) => handleChange('greetingMessage', e.target.value)}
                sx={{ mb: 2 }}
              />

              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableAppointments}
                      onChange={(e) => handleChange('enableAppointments', e.target.checked)}
                    />
                  }
                  label="Enable Appointment Booking"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableEmergencyDetection}
                      onChange={(e) => handleChange('enableEmergencyDetection', e.target.checked)}
                    />
                  }
                  label="Enable Emergency Detection"
                />
              </Box>

              {settings.enableEmergencyDetection && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Emergency detection will identify urgent dental issues and offer immediate assistance or ER referral.
                </Alert>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Actions */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={saveSettings}
                  disabled={saveStatus === 'saving'}
                  startIcon={saveStatus === 'saving' ? <CircularProgress size={20} /> : <SaveIcon />}
                >
                  {saveStatus === 'saving' ? 'Saving...' : 'Save Settings'}
                </Button>

                <Button
                  variant="outlined"
                  onClick={testConnection}
                  disabled={testStatus === 'testing'}
                  startIcon={testStatus === 'testing' ? <CircularProgress size={20} /> : <TestIcon />}
                >
                  {testStatus === 'testing' ? 'Testing...' : 'Test Connection'}
                </Button>

                {saveStatus === 'saved' && (
                  <Chip label="Settings saved successfully!" color="success" />
                )}

                {saveStatus === 'error' && (
                  <Chip label="Error saving settings" color="error" />
                )}

                {testStatus === 'success' && (
                  <Chip label="Connection successful!" color="success" />
                )}

                {testStatus === 'error' && (
                  <Chip label="Connection failed" color="error" />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Information */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Status
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Voice Service
                  </Typography>
                  <Chip
                    label={settings.enabled ? "Active" : "Inactive"}
                    color={settings.enabled ? "success" : "default"}
                    size="small"
                  />
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Phone Number
                  </Typography>
                  <Typography variant="body1">
                    {settings.twilioPhoneNumber}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    AI Model
                  </Typography>
                  <Typography variant="body1">
                    {settings.llmModel}
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Voice
                  </Typography>
                  <Typography variant="body1">
                    {settings.voiceModel.split('-').pop()?.replace('en', '')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VoiceAISettings;