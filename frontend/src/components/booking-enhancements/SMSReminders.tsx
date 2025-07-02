import React, { useState } from 'react';
import { MessageSquare, Bell, Clock, Settings, Check, X, AlertCircle } from 'lucide-react';

interface SMSReminderSettings {
  enabled: boolean;
  reminderTimes: number[]; // Hours before appointment
  customMessage: string;
  includeLocation: boolean;
  includeProviderInfo: boolean;
  allowReschedule: boolean;
  allowCancellation: boolean;
  phoneNumber: string;
  consentGiven: boolean;
}

interface SMSProvider {
  id: string;
  name: string;
  supported: boolean;
  requiresApiKey: boolean;
  configured: boolean;
}

interface SMSReminderProps {
  onSaveSettings: (settings: SMSReminderSettings) => void;
  currentSettings?: SMSReminderSettings;
  appointment?: {
    id: string;
    date: string;
    time: string;
    service: string;
    provider: string;
    location: string;
  };
}

const smsProviders: SMSProvider[] = [
  { id: 'twilio', name: 'Twilio', supported: true, requiresApiKey: true, configured: false },
  { id: 'vonage', name: 'Vonage (Nexmo)', supported: true, requiresApiKey: true, configured: false },
  { id: 'aws-sns', name: 'AWS SNS', supported: true, requiresApiKey: true, configured: false },
  { id: 'messagebird', name: 'MessageBird', supported: true, requiresApiKey: true, configured: false },
];

const defaultReminderTimes = [24, 2]; // 24 hours and 2 hours before

export const SMSReminderSettings: React.FC<SMSReminderProps> = ({
  onSaveSettings,
  currentSettings,
  appointment,
}) => {
  const [settings, setSettings] = useState<SMSReminderSettings>(currentSettings || {
    enabled: false,
    reminderTimes: defaultReminderTimes,
    customMessage: 'Hi {name}, this is a reminder about your appointment for {service} with {provider} on {date} at {time}.',
    includeLocation: true,
    includeProviderInfo: true,
    allowReschedule: true,
    allowCancellation: true,
    phoneNumber: '',
    consentGiven: false,
  });

  const [selectedProvider, setSelectedProvider] = useState<string>('twilio');
  const [showPreview, setShowPreview] = useState(false);
  const [testSent, setTestSent] = useState(false);

  const reminderOptions = [
    { value: 0.5, label: '30 minutes' },
    { value: 1, label: '1 hour' },
    { value: 2, label: '2 hours' },
    { value: 4, label: '4 hours' },
    { value: 24, label: '24 hours' },
    { value: 48, label: '48 hours' },
    { value: 72, label: '72 hours' },
    { value: 168, label: '1 week' },
  ];

  const messageVariables = [
    { key: '{name}', description: 'Client name' },
    { key: '{service}', description: 'Service name' },
    { key: '{provider}', description: 'Provider name' },
    { key: '{date}', description: 'Appointment date' },
    { key: '{time}', description: 'Appointment time' },
    { key: '{location}', description: 'Location/Address' },
    { key: '{duration}', description: 'Service duration' },
    { key: '{price}', description: 'Service price' },
  ];

  const handleReminderTimeToggle = (hours: number) => {
    if (settings.reminderTimes.includes(hours)) {
      setSettings({
        ...settings,
        reminderTimes: settings.reminderTimes.filter(h => h !== hours),
      });
    } else {
      setSettings({
        ...settings,
        reminderTimes: [...settings.reminderTimes, hours].sort((a, b) => b - a),
      });
    }
  };

  const generatePreviewMessage = () => {
    let message = settings.customMessage;
    const replacements = {
      '{name}': 'John Doe',
      '{service}': appointment?.service || 'Hair Cut',
      '{provider}': appointment?.provider || 'Jane Smith',
      '{date}': appointment?.date || 'March 15, 2024',
      '{time}': appointment?.time || '2:00 PM',
      '{location}': appointment?.location || '123 Main St, Suite 100',
      '{duration}': '60 minutes',
      '{price}': '$50',
    };

    Object.entries(replacements).forEach(([key, value]) => {
      message = message.replace(new RegExp(key, 'g'), value);
    });

    if (settings.includeLocation) {
      message += `\n\nLocation: ${replacements['{location}']}`;
    }

    if (settings.allowReschedule || settings.allowCancellation) {
      message += '\n\n';
      if (settings.allowReschedule) message += 'Reply R to reschedule. ';
      if (settings.allowCancellation) message += 'Reply C to cancel.';
    }

    return message;
  };

  const handleTestSMS = () => {
    // Simulate sending test SMS
    setTestSent(true);
    setTimeout(() => setTestSent(false), 3000);
  };

  const handleSave = () => {
    if (settings.enabled && !settings.phoneNumber) {
      alert('Please enter a phone number');
      return;
    }
    if (settings.enabled && !settings.consentGiven) {
      alert('Please confirm SMS consent');
      return;
    }
    onSaveSettings(settings);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>SMS Reminder Settings</span>
          </h2>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Enable SMS Reminders</span>
          </label>
        </div>

        {settings.enabled && (
          <>
            {/* Phone Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="flex space-x-2">
                <input
                  type="tel"
                  value={settings.phoneNumber}
                  onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                  placeholder="+1 (555) 123-4567"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={handleTestSMS}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {testSent ? (
                    <span className="flex items-center space-x-1">
                      <Check className="w-4 h-4" />
                      <span>Sent!</span>
                    </span>
                  ) : (
                    'Test SMS'
                  )}
                </button>
              </div>
            </div>

            {/* SMS Provider Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SMS Provider
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {smsProviders.map(provider => (
                  <button
                    key={provider.id}
                    onClick={() => setSelectedProvider(provider.id)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      selectedProvider === provider.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    <div>{provider.name}</div>
                    {provider.configured && (
                      <Check className="w-4 h-4 text-green-500 mx-auto mt-1" />
                    )}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Configure your SMS provider API credentials in Settings → Integrations
              </p>
            </div>

            {/* Reminder Times */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Send Reminders
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {reminderOptions.map(option => (
                  <label
                    key={option.value}
                    className="flex items-center space-x-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={settings.reminderTimes.includes(option.value)}
                      onChange={() => handleReminderTimeToggle(option.value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{option.label} before</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Message Template */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Message Template
                </label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </button>
              </div>
              <textarea
                value={settings.customMessage}
                onChange={(e) => setSettings({ ...settings, customMessage: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {messageVariables.map(variable => (
                  <span
                    key={variable.key}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 text-xs text-gray-700 rounded"
                    title={variable.description}
                  >
                    {variable.key}
                  </span>
                ))}
              </div>
            </div>

            {/* Message Preview */}
            {showPreview && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Message Preview</h4>
                <div className="p-3 bg-white rounded border border-gray-200">
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap font-sans">
                    {generatePreviewMessage()}
                  </pre>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Character count: {generatePreviewMessage().length} / 160
                </p>
              </div>
            )}

            {/* Additional Options */}
            <div className="mb-6 space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.includeLocation}
                  onChange={(e) => setSettings({ ...settings, includeLocation: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include location in reminder</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.includeProviderInfo}
                  onChange={(e) => setSettings({ ...settings, includeProviderInfo: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Include provider information</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.allowReschedule}
                  onChange={(e) => setSettings({ ...settings, allowReschedule: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Allow rescheduling via SMS reply</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={settings.allowCancellation}
                  onChange={(e) => setSettings({ ...settings, allowCancellation: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Allow cancellation via SMS reply</span>
              </label>
            </div>

            {/* Consent */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <label className="flex items-start space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.consentGiven}
                      onChange={(e) => setSettings({ ...settings, consentGiven: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span className="text-sm text-gray-700">
                      I confirm that I have consent to send SMS messages to this phone number.
                      Standard messaging rates may apply.
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};

// SMS History Component
export const SMSHistory: React.FC<{ appointmentId: string }> = ({ appointmentId }) => {
  const [history] = useState([
    {
      id: '1',
      type: 'reminder',
      sentAt: '2024-03-14 10:00 AM',
      message: 'Hi John, reminder about your appointment tomorrow at 2:00 PM.',
      status: 'delivered',
      response: null,
    },
    {
      id: '2',
      type: 'reminder',
      sentAt: '2024-03-15 12:00 PM',
      message: 'Hi John, your appointment is in 2 hours at 2:00 PM.',
      status: 'delivered',
      response: 'R',
    },
    {
      id: '3',
      type: 'system',
      sentAt: '2024-03-15 12:05 PM',
      message: 'To reschedule, please call us at (555) 123-4567 or visit our website.',
      status: 'delivered',
      response: null,
    },
  ]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <X className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">SMS History</h3>
      
      <div className="space-y-3">
        {history.map(item => (
          <div key={item.id} className="border-l-2 border-gray-200 pl-4 py-2">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">
                  {item.type === 'reminder' ? 'Reminder' : 'System Message'}
                </span>
                {getStatusIcon(item.status)}
              </div>
              <span className="text-xs text-gray-500">{item.sentAt}</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{item.message}</p>
            {item.response && (
              <div className="mt-2 p-2 bg-gray-50 rounded">
                <p className="text-xs text-gray-500">Client Response:</p>
                <p className="text-sm text-gray-700">{item.response}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};