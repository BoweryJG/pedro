import React, { useState } from 'react';
import { 
  Calendar,
  Clock,
  Plane,
  Coffee,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  ToggleLeft,
  ToggleRight,
  Users,
  Bell
} from 'lucide-react';

interface TimeOff {
  id: string;
  type: 'vacation' | 'sick' | 'personal' | 'conference' | 'other';
  startDate: string;
  endDate: string;
  allDay: boolean;
  startTime?: string;
  endTime?: string;
  reason: string;
  autoReply: boolean;
  autoReplyMessage?: string;
  reassignTo?: string;
  notifyClients: boolean;
}

interface WorkingHours {
  dayOfWeek: number;
  enabled: boolean;
  startTime: string;
  endTime: string;
  breakStart?: string;
  breakEnd?: string;
}

interface ProviderAvailabilityProps {
  providerId: string;
  providerName: string;
  providers: Array<{ id: string; name: string }>;
  timeOffs: TimeOff[];
  workingHours: WorkingHours[];
  onSaveTimeOff: (timeOff: TimeOff) => void;
  onDeleteTimeOff: (id: string) => void;
  onSaveWorkingHours: (hours: WorkingHours[]) => void;
}

const timeOffTypes = [
  { value: 'vacation', label: 'Vacation', icon: Plane, color: 'bg-blue-100 text-blue-700' },
  { value: 'sick', label: 'Sick Leave', icon: AlertCircle, color: 'bg-red-100 text-red-700' },
  { value: 'personal', label: 'Personal', icon: Clock, color: 'bg-purple-100 text-purple-700' },
  { value: 'conference', label: 'Conference', icon: Users, color: 'bg-green-100 text-green-700' },
  { value: 'other', label: 'Other', icon: Coffee, color: 'bg-gray-100 text-gray-700' },
];

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const ProviderAvailabilityManager: React.FC<ProviderAvailabilityProps> = ({
  providerId,
  providerName,
  providers,
  timeOffs,
  workingHours: initialWorkingHours,
  onSaveTimeOff,
  onDeleteTimeOff,
  onSaveWorkingHours,
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'timeoff'>('schedule');
  const [showTimeOffForm, setShowTimeOffForm] = useState(false);
  const [editingTimeOff, setEditingTimeOff] = useState<TimeOff | null>(null);
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>(initialWorkingHours);

  const [timeOffForm, setTimeOffForm] = useState<TimeOff>({
    id: '',
    type: 'vacation',
    startDate: '',
    endDate: '',
    allDay: true,
    reason: '',
    autoReply: true,
    autoReplyMessage: `I am currently out of office and will return on {endDate}. For urgent matters, please contact {reassignTo}.`,
    notifyClients: true,
  });

  const handleTimeOffSubmit = () => {
    const timeOff = {
      ...timeOffForm,
      id: editingTimeOff?.id || Date.now().toString(),
    };
    onSaveTimeOff(timeOff);
    setShowTimeOffForm(false);
    setEditingTimeOff(null);
    resetTimeOffForm();
  };

  const resetTimeOffForm = () => {
    setTimeOffForm({
      id: '',
      type: 'vacation',
      startDate: '',
      endDate: '',
      allDay: true,
      reason: '',
      autoReply: true,
      autoReplyMessage: `I am currently out of office and will return on {endDate}. For urgent matters, please contact {reassignTo}.`,
      notifyClients: true,
    });
  };

  const handleEditTimeOff = (timeOff: TimeOff) => {
    setTimeOffForm(timeOff);
    setEditingTimeOff(timeOff);
    setShowTimeOffForm(true);
  };

  const handleWorkingHoursChange = (dayIndex: number, field: keyof WorkingHours, value: any) => {
    const updated = workingHours.map((day, index) => 
      index === dayIndex ? { ...day, [field]: value } : day
    );
    setWorkingHours(updated);
  };

  const TimeOffForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {editingTimeOff ? 'Edit Time Off' : 'Add Time Off'}
          </h3>
          <button
            onClick={() => {
              setShowTimeOffForm(false);
              setEditingTimeOff(null);
              resetTimeOffForm();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {timeOffTypes.map(type => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setTimeOffForm({ ...timeOffForm, type: type.value as any })}
                    className={`p-3 rounded-lg border text-sm font-medium transition-colors ${
                      timeOffForm.type === type.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mx-auto mb-1" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={timeOffForm.startDate}
                onChange={(e) => setTimeOffForm({ ...timeOffForm, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={timeOffForm.endDate}
                onChange={(e) => setTimeOffForm({ ...timeOffForm, endDate: e.target.value })}
                min={timeOffForm.startDate}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={timeOffForm.allDay}
                onChange={(e) => setTimeOffForm({ ...timeOffForm, allDay: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">All Day</span>
            </label>
          </div>

          {!timeOffForm.allDay && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={timeOffForm.startTime || ''}
                  onChange={(e) => setTimeOffForm({ ...timeOffForm, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={timeOffForm.endTime || ''}
                  onChange={(e) => setTimeOffForm({ ...timeOffForm, endTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reason / Notes
            </label>
            <textarea
              value={timeOffForm.reason}
              onChange={(e) => setTimeOffForm({ ...timeOffForm, reason: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Optional: Add any notes or reasons..."
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={timeOffForm.notifyClients}
                onChange={(e) => setTimeOffForm({ ...timeOffForm, notifyClients: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Notify clients with upcoming appointments
              </span>
            </label>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={timeOffForm.autoReply}
                onChange={(e) => setTimeOffForm({ ...timeOffForm, autoReply: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Enable auto-reply for new booking requests
              </span>
            </label>
          </div>

          {timeOffForm.autoReply && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auto-Reply Message
                </label>
                <textarea
                  value={timeOffForm.autoReplyMessage}
                  onChange={(e) => setTimeOffForm({ ...timeOffForm, autoReplyMessage: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Variables: {'{endDate}'}, {'{reassignTo}'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reassign Appointments To
                </label>
                <select
                  value={timeOffForm.reassignTo || ''}
                  onChange={(e) => setTimeOffForm({ ...timeOffForm, reassignTo: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">None - Block all appointments</option>
                  {providers.filter(p => p.id !== providerId).map(provider => (
                    <option key={provider.id} value={provider.name}>
                      {provider.name}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              onClick={handleTimeOffSubmit}
              className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {editingTimeOff ? 'Update' : 'Save'} Time Off
            </button>
            <button
              onClick={() => {
                setShowTimeOffForm(false);
                setEditingTimeOff(null);
                resetTimeOffForm();
              }}
              className="flex-1 py-2 px-4 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const WorkingHoursTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Regular Working Hours</h3>
        <button
          onClick={() => onSaveWorkingHours(workingHours)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Save className="w-4 h-4 inline mr-1" />
          Save Changes
        </button>
      </div>

      <div className="space-y-3">
        {workingHours.map((day, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleWorkingHoursChange(index, 'enabled', !day.enabled)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {day.enabled ? (
                    <ToggleRight className="w-5 h-5 text-blue-600" />
                  ) : (
                    <ToggleLeft className="w-5 h-5" />
                  )}
                </button>
                <span className={`font-medium ${day.enabled ? 'text-gray-900' : 'text-gray-400'}`}>
                  {daysOfWeek[day.dayOfWeek]}
                </span>
              </div>
            </div>

            {day.enabled && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={day.startTime}
                    onChange={(e) => handleWorkingHoursChange(index, 'startTime', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">End Time</label>
                  <input
                    type="time"
                    value={day.endTime}
                    onChange={(e) => handleWorkingHoursChange(index, 'endTime', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Break Start</label>
                  <input
                    type="time"
                    value={day.breakStart || ''}
                    onChange={(e) => handleWorkingHoursChange(index, 'breakStart', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Break End</label>
                  <input
                    type="time"
                    value={day.breakEnd || ''}
                    onChange={(e) => handleWorkingHoursChange(index, 'breakEnd', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">Quick Actions</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              // Apply 9-5 Monday-Friday
              const newHours = workingHours.map((day, index) => ({
                ...day,
                enabled: index >= 1 && index <= 5,
                startTime: '09:00',
                endTime: '17:00',
                breakStart: '12:00',
                breakEnd: '13:00',
              }));
              setWorkingHours(newHours);
            }}
            className="px-3 py-1 text-sm bg-white text-blue-700 rounded hover:bg-blue-100"
          >
            Set 9-5 Mon-Fri
          </button>
          <button
            onClick={() => {
              // Copy Monday's hours to Tuesday-Friday
              const mondayHours = workingHours[1];
              const newHours = workingHours.map((day, index) => 
                index >= 2 && index <= 5 ? { ...mondayHours, dayOfWeek: index } : day
              );
              setWorkingHours(newHours);
            }}
            className="px-3 py-1 text-sm bg-white text-blue-700 rounded hover:bg-blue-100"
          >
            Copy Monday to Weekdays
          </button>
        </div>
      </div>
    </div>
  );

  const TimeOffTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Time Off & Vacation</h3>
        <button
          onClick={() => setShowTimeOffForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Plus className="w-4 h-4 inline mr-1" />
          Add Time Off
        </button>
      </div>

      {timeOffs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No time off scheduled</p>
          <button
            onClick={() => setShowTimeOffForm(true)}
            className="mt-4 text-blue-600 hover:text-blue-700"
          >
            Schedule time off
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {timeOffs.map(timeOff => {
            const typeConfig = timeOffTypes.find(t => t.value === timeOff.type);
            const Icon = typeConfig?.icon || Clock;

            return (
              <div key={timeOff.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${typeConfig?.color || 'bg-gray-100'}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {typeConfig?.label} - {timeOff.reason || 'No reason specified'}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(timeOff.startDate).toLocaleDateString()} - {new Date(timeOff.endDate).toLocaleDateString()}
                        {!timeOff.allDay && ` (${timeOff.startTime} - ${timeOff.endTime})`}
                      </p>
                      {timeOff.reassignTo && (
                        <p className="text-sm text-gray-600 mt-1">
                          Appointments reassigned to: {timeOff.reassignTo}
                        </p>
                      )}
                      <div className="flex items-center space-x-4 mt-2">
                        {timeOff.autoReply && (
                          <span className="inline-flex items-center text-xs text-gray-500">
                            <Bell className="w-3 h-3 mr-1" />
                            Auto-reply enabled
                          </span>
                        )}
                        {timeOff.notifyClients && (
                          <span className="inline-flex items-center text-xs text-gray-500">
                            <Users className="w-3 h-3 mr-1" />
                            Clients notified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditTimeOff(timeOff)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteTimeOff(timeOff.id)}
                      className="p-1 text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <div className="px-6 py-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Availability Settings - {providerName}
            </h2>
          </div>
          <div className="px-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => setActiveTab('schedule')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'schedule'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Working Hours
              </button>
              <button
                onClick={() => setActiveTab('timeoff')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'timeoff'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Time Off
              </button>
            </nav>
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'schedule' && <WorkingHoursTab />}
          {activeTab === 'timeoff' && <TimeOffTab />}
        </div>
      </div>

      {showTimeOffForm && <TimeOffForm />}
    </div>
  );
};