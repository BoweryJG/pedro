import React, { useState, useEffect } from 'react';
import { Calendar, Sync, Check, AlertCircle, ExternalLink, Download, Plus } from 'lucide-react';

interface CalendarProvider {
  id: string;
  name: string;
  icon: string;
  color: string;
  connected: boolean;
  calendars?: CalendarInfo[];
}

interface CalendarInfo {
  id: string;
  name: string;
  primary: boolean;
  selected: boolean;
  color: string;
}

interface SyncSettings {
  provider: string;
  calendarId: string;
  syncDirection: 'one-way' | 'two-way';
  includeDetails: boolean;
  blockTimeSlots: boolean;
  bufferTime: number;
  reminderMinutes: number;
}

interface CalendarSyncProps {
  onConnect: (provider: string) => void;
  onDisconnect: (provider: string) => void;
  onSaveSettings: (settings: SyncSettings) => void;
  appointment?: {
    id: string;
    title: string;
    date: string;
    time: string;
    duration: number;
    location: string;
    description: string;
  };
}

const calendarProviders: CalendarProvider[] = [
  {
    id: 'google',
    name: 'Google Calendar',
    icon: '📅',
    color: 'bg-blue-500',
    connected: false,
  },
  {
    id: 'outlook',
    name: 'Outlook Calendar',
    icon: '📆',
    color: 'bg-blue-600',
    connected: false,
  },
  {
    id: 'apple',
    name: 'Apple Calendar',
    icon: '🗓️',
    color: 'bg-gray-800',
    connected: false,
  },
  {
    id: 'ical',
    name: 'iCal Feed',
    icon: '📊',
    color: 'bg-green-600',
    connected: false,
  },
];

export const CalendarSync: React.FC<CalendarSyncProps> = ({
  onConnect,
  onDisconnect,
  onSaveSettings,
  appointment,
}) => {
  const [providers, setProviders] = useState<CalendarProvider[]>(calendarProviders);
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [showSettings, setShowSettings] = useState<string>('');
  const [syncSettings, setSyncSettings] = useState<SyncSettings>({
    provider: '',
    calendarId: '',
    syncDirection: 'two-way',
    includeDetails: true,
    blockTimeSlots: true,
    bufferTime: 0,
    reminderMinutes: 30,
  });
  const [icalUrl, setIcalUrl] = useState<string>('');

  // Simulate loading calendars after connection
  useEffect(() => {
    if (selectedProvider && providers.find(p => p.id === selectedProvider)?.connected) {
      // Simulate API call to fetch calendars
      setTimeout(() => {
        setProviders(prev => prev.map(provider => {
          if (provider.id === selectedProvider) {
            return {
              ...provider,
              calendars: [
                { id: '1', name: 'Primary Calendar', primary: true, selected: true, color: '#4285f4' },
                { id: '2', name: 'Work Calendar', primary: false, selected: false, color: '#ea4335' },
                { id: '3', name: 'Personal Calendar', primary: false, selected: false, color: '#34a853' },
              ],
            };
          }
          return provider;
        }));
      }, 1000);
    }
  }, [selectedProvider]);

  const handleConnect = (providerId: string) => {
    setProviders(prev => prev.map(provider => {
      if (provider.id === providerId) {
        return { ...provider, connected: true };
      }
      return provider;
    }));
    setSelectedProvider(providerId);
    onConnect(providerId);
  };

  const handleDisconnect = (providerId: string) => {
    setProviders(prev => prev.map(provider => {
      if (provider.id === providerId) {
        return { ...provider, connected: false, calendars: undefined };
      }
      return provider;
    }));
    onDisconnect(providerId);
  };

  const generateICalEvent = () => {
    if (!appointment) return '';

    const startDate = new Date(`${appointment.date}T${appointment.time}`);
    const endDate = new Date(startDate.getTime() + appointment.duration * 60000);

    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    const icalContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Booking System//EN',
      'BEGIN:VEVENT',
      `UID:${appointment.id}@bookingsystem.com`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART:${formatDate(startDate)}`,
      `DTEND:${formatDate(endDate)}`,
      `SUMMARY:${appointment.title}`,
      `DESCRIPTION:${appointment.description}`,
      `LOCATION:${appointment.location}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    return icalContent;
  };

  const downloadICalFile = () => {
    const content = generateICalEvent();
    const blob = new Blob([content], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `appointment-${appointment?.id || 'event'}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const generateICalFeedUrl = () => {
    // In a real implementation, this would generate a secure URL on the backend
    const baseUrl = window.location.origin;
    const token = btoa(`user-${Date.now()}`); // Simplified token generation
    return `${baseUrl}/api/calendar/feed/${token}`;
  };

  const CalendarProviderCard = ({ provider }: { provider: CalendarProvider }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 ${provider.color} rounded-lg flex items-center justify-center text-white text-xl`}>
            {provider.icon}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{provider.name}</h3>
            <p className="text-sm text-gray-500">
              {provider.connected ? 'Connected' : 'Not connected'}
            </p>
          </div>
        </div>
        {provider.connected && (
          <Check className="w-5 h-5 text-green-500" />
        )}
      </div>

      {!provider.connected ? (
        <button
          onClick={() => handleConnect(provider.id)}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Connect
        </button>
      ) : (
        <div className="space-y-2">
          <button
            onClick={() => setShowSettings(showSettings === provider.id ? '' : provider.id)}
            className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            {showSettings === provider.id ? 'Hide Settings' : 'Settings'}
          </button>
          <button
            onClick={() => handleDisconnect(provider.id)}
            className="w-full py-2 px-4 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Disconnect
          </button>
        </div>
      )}

      {provider.id === 'ical' && provider.connected && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-700 mb-2">Subscribe to your calendar feed:</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={icalUrl || generateICalFeedUrl()}
              readOnly
              className="flex-1 px-3 py-1 text-sm bg-white border border-gray-300 rounded"
              onClick={(e) => e.currentTarget.select()}
            />
            <button
              onClick={() => {
                const url = icalUrl || generateICalFeedUrl();
                setIcalUrl(url);
                navigator.clipboard.writeText(url);
              }}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const CalendarSettings = ({ provider }: { provider: CalendarProvider }) => (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
      {provider.calendars && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Calendars to Sync
          </label>
          <div className="space-y-2">
            {provider.calendars.map(calendar => (
              <label key={calendar.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={calendar.selected}
                  onChange={(e) => {
                    setProviders(prev => prev.map(p => {
                      if (p.id === provider.id) {
                        return {
                          ...p,
                          calendars: p.calendars?.map(c => 
                            c.id === calendar.id ? { ...c, selected: e.target.checked } : c
                          ),
                        };
                      }
                      return p;
                    }));
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: calendar.color }}
                />
                <span className="text-sm text-gray-700">
                  {calendar.name}
                  {calendar.primary && (
                    <span className="ml-2 text-xs text-gray-500">(Primary)</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sync Direction
        </label>
        <select
          value={syncSettings.syncDirection}
          onChange={(e) => setSyncSettings({ ...syncSettings, syncDirection: e.target.value as any })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="two-way">Two-way sync</option>
          <option value="one-way">One-way (Booking → Calendar)</option>
        </select>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={syncSettings.includeDetails}
            onChange={(e) => setSyncSettings({ ...syncSettings, includeDetails: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Include appointment details</span>
        </label>
      </div>

      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={syncSettings.blockTimeSlots}
            onChange={(e) => setSyncSettings({ ...syncSettings, blockTimeSlots: e.target.checked })}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700">Block time slots from calendar events</span>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Buffer Time (minutes)
        </label>
        <input
          type="number"
          min="0"
          max="60"
          value={syncSettings.bufferTime}
          onChange={(e) => setSyncSettings({ ...syncSettings, bufferTime: parseInt(e.target.value) || 0 })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Default Reminder (minutes before)
        </label>
        <select
          value={syncSettings.reminderMinutes}
          onChange={(e) => setSyncSettings({ ...syncSettings, reminderMinutes: parseInt(e.target.value) })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="0">No reminder</option>
          <option value="15">15 minutes</option>
          <option value="30">30 minutes</option>
          <option value="60">1 hour</option>
          <option value="1440">1 day</option>
        </select>
      </div>

      <button
        onClick={() => {
          onSaveSettings({ ...syncSettings, provider: provider.id });
          setShowSettings('');
        }}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Save Settings
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span>Calendar Integration</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {providers.map(provider => (
            <div key={provider.id}>
              <CalendarProviderCard provider={provider} />
              {showSettings === provider.id && provider.connected && (
                <CalendarSettings provider={provider} />
              )}
            </div>
          ))}
        </div>

        {appointment && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-blue-900">Add to Calendar</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Download this appointment as a calendar file
                </p>
              </div>
              <button
                onClick={downloadICalFile}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <Download className="w-4 h-4" />
                <span>Download .ics</span>
              </button>
            </div>
          </div>
        )}

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium">Calendar Sync Information</p>
              <ul className="mt-2 space-y-1 list-disc list-inside">
                <li>Two-way sync updates both your calendar and booking system</li>
                <li>Buffer time adds extra time before/after appointments</li>
                <li>Calendar events will block booking slots when enabled</li>
                <li>Changes may take up to 5 minutes to sync</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Calendar Event Component
export const CalendarEvent: React.FC<{ appointment: any }> = ({ appointment }) => {
  const [addedToCalendar, setAddedToCalendar] = useState(false);

  const handleAddToCalendar = (type: string) => {
    const startDate = new Date(`${appointment.date}T${appointment.time}`);
    const endDate = new Date(startDate.getTime() + appointment.duration * 60000);

    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    };

    switch (type) {
      case 'google':
        const googleUrl = new URL('https://calendar.google.com/calendar/render');
        googleUrl.searchParams.append('action', 'TEMPLATE');
        googleUrl.searchParams.append('text', appointment.title);
        googleUrl.searchParams.append('dates', `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`);
        googleUrl.searchParams.append('details', appointment.description);
        googleUrl.searchParams.append('location', appointment.location);
        window.open(googleUrl.toString(), '_blank');
        break;

      case 'outlook':
        const outlookUrl = new URL('https://outlook.live.com/calendar/0/deeplink/compose');
        outlookUrl.searchParams.append('subject', appointment.title);
        outlookUrl.searchParams.append('startdt', startDate.toISOString());
        outlookUrl.searchParams.append('enddt', endDate.toISOString());
        outlookUrl.searchParams.append('body', appointment.description);
        outlookUrl.searchParams.append('location', appointment.location);
        window.open(outlookUrl.toString(), '_blank');
        break;

      case 'yahoo':
        const yahooUrl = new URL('https://calendar.yahoo.com/');
        yahooUrl.searchParams.append('v', '60');
        yahooUrl.searchParams.append('title', appointment.title);
        yahooUrl.searchParams.append('st', formatGoogleDate(startDate));
        yahooUrl.searchParams.append('et', formatGoogleDate(endDate));
        yahooUrl.searchParams.append('desc', appointment.description);
        yahooUrl.searchParams.append('in_loc', appointment.location);
        window.open(yahooUrl.toString(), '_blank');
        break;
    }

    setAddedToCalendar(true);
    setTimeout(() => setAddedToCalendar(false), 3000);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Add to Your Calendar</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => handleAddToCalendar('google')}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span>📅</span>
          <span>Google Calendar</span>
        </button>
        
        <button
          onClick={() => handleAddToCalendar('outlook')}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
        >
          <span>📆</span>
          <span>Outlook</span>
        </button>
        
        <button
          onClick={() => handleAddToCalendar('yahoo')}
          className="flex items-center justify-center space-x-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600"
        >
          <span>📊</span>
          <span>Yahoo Calendar</span>
        </button>
      </div>

      {addedToCalendar && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <Check className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-700">Calendar event opened in new tab</p>
        </div>
      )}
    </div>
  );
};