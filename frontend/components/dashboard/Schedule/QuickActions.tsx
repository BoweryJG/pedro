import React, { useState } from 'react';
import { 
  Phone, 
  MessageSquare, 
  Mail, 
  Calendar,
  Clock,
  FileText,
  Video,
  AlertCircle,
  CheckCircle,
  XCircle,
  Send,
  X,
  User,
  DollarSign,
  CreditCard,
  Stethoscope
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  lastVisit?: string;
  nextAppointment?: string;
  balance?: number;
}

interface QuickAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  color: string;
  action: (patient: Patient) => void;
}

interface QuickActionsProps {
  patient?: Patient;
  onActionComplete?: (action: string, result: any) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ patient, onActionComplete }) => {
  const [showCallModal, setShowCallModal] = useState(false);
  const [showSMSModal, setShowSMSModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [smsMessage, setSmsMessage] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [callNotes, setCallNotes] = useState('');

  const quickActions: QuickAction[] = [
    {
      id: 'call',
      icon: <Phone className="w-5 h-5" />,
      label: 'Call Patient',
      color: 'bg-green-500 hover:bg-green-600',
      action: () => setShowCallModal(true)
    },
    {
      id: 'sms',
      icon: <MessageSquare className="w-5 h-5" />,
      label: 'Send SMS',
      color: 'bg-blue-500 hover:bg-blue-600',
      action: () => setShowSMSModal(true)
    },
    {
      id: 'email',
      icon: <Mail className="w-5 h-5" />,
      label: 'Send Email',
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => setShowEmailModal(true)
    },
    {
      id: 'video',
      icon: <Video className="w-5 h-5" />,
      label: 'Video Call',
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: () => console.log('Starting video call...')
    },
    {
      id: 'chart',
      icon: <Stethoscope className="w-5 h-5" />,
      label: 'View Chart',
      color: 'bg-pink-500 hover:bg-pink-600',
      action: () => console.log('Opening patient chart...')
    },
    {
      id: 'payment',
      icon: <CreditCard className="w-5 h-5" />,
      label: 'Process Payment',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      action: () => console.log('Processing payment...')
    }
  ];

  const smsTemplates = [
    {
      name: 'Appointment Reminder',
      message: `Hi {name}, this is Dr. Pedro's office reminding you of your appointment tomorrow at {time}. Reply YES to confirm or call us to reschedule.`
    },
    {
      name: 'Follow-up',
      message: `Hi {name}, it's been a few days since your procedure. How are you feeling? If you have any concerns, please don't hesitate to call us.`
    },
    {
      name: 'Schedule Next Visit',
      message: `Hi {name}, it's time for your regular check-up. Please call us at your convenience to schedule your next appointment.`
    }
  ];

  const handleCall = () => {
    // Implement actual call functionality
    console.log('Calling patient:', patient?.phone);
    onActionComplete?.('call', { notes: callNotes });
    setShowCallModal(false);
    setCallNotes('');
  };

  const handleSMS = () => {
    // Implement actual SMS functionality
    console.log('Sending SMS to:', patient?.phone, 'Message:', smsMessage);
    onActionComplete?.('sms', { message: smsMessage });
    setShowSMSModal(false);
    setSmsMessage('');
  };

  const handleEmail = () => {
    // Implement actual email functionality
    console.log('Sending email to:', patient?.email, 'Subject:', emailSubject);
    onActionComplete?.('email', { subject: emailSubject, body: emailBody });
    setShowEmailModal(false);
    setEmailSubject('');
    setEmailBody('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Luxury Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-light tracking-wide">Quick Actions</h2>
              <p className="text-sm text-gray-300 mt-1">Instant Patient Communication</p>
            </div>
          </div>
          {patient && (
            <div className="text-right">
              <p className="text-lg font-medium">{patient.name}</p>
              <p className="text-sm text-gray-300">{patient.phone}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions Grid */}
      <div className="p-6">
        {patient ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => action.action(patient)}
                className={`${action.color} text-white rounded-xl p-4 transition-all transform hover:scale-105 hover:shadow-lg flex flex-col items-center space-y-2`}
              >
                <div className="p-3 bg-white/20 rounded-lg">
                  {action.icon}
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Select a patient to view quick actions</p>
          </div>
        )}

        {/* Recent Actions */}
        {patient && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Actions</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Called patient</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="w-4 h-4 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium">Sent appointment reminder</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Call Modal */}
      {showCallModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Call Patient</h3>
              <button
                onClick={() => setShowCallModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Calling:</p>
                <p className="text-lg font-medium">{patient?.name}</p>
                <p className="text-blue-600">{patient?.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Call Notes
                </label>
                <textarea
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Add notes about this call..."
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleCall}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Phone className="w-4 h-4" />
                  <span>Start Call</span>
                </button>
                <button
                  onClick={() => setShowCallModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SMS Modal */}
      {showSMSModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Send SMS</h3>
              <button
                onClick={() => setShowSMSModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">To:</p>
                <p className="text-lg font-medium">{patient?.name}</p>
                <p className="text-blue-600">{patient?.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Templates
                </label>
                <select
                  onChange={(e) => {
                    const template = smsTemplates[parseInt(e.target.value)];
                    if (template) {
                      setSmsMessage(
                        template.message
                          .replace('{name}', patient?.name || '')
                          .replace('{time}', '2:00 PM')
                      );
                    }
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a template...</option>
                  {smsTemplates.map((template, index) => (
                    <option key={index} value={index}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Type your message..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {smsMessage.length}/160 characters
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSMS}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send SMS</span>
                </button>
                <button
                  onClick={() => setShowSMSModal(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickActions;