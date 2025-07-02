import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Calendar, 
  RefreshCw, 
  Star, 
  Filter,
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  User,
  MapPin,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface Appointment {
  id: string;
  date: string;
  time: string;
  service: string;
  provider: string;
  status: 'completed' | 'cancelled' | 'no-show' | 'upcoming';
  price: number;
  duration: number;
  location: string;
  rating?: number;
  review?: string;
  notes?: string;
  rebookable: boolean;
}

interface AppointmentHistoryProps {
  appointments: Appointment[];
  onRebook: (appointment: Appointment) => void;
  onViewDetails: (appointment: Appointment) => void;
  onExport: (format: 'csv' | 'pdf') => void;
}

export const AppointmentHistory: React.FC<AppointmentHistoryProps> = ({
  appointments,
  onRebook,
  onViewDetails,
  onExport,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterProvider, setFilterProvider] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'service' | 'provider'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Extract unique providers for filter
  const providers = useMemo(() => {
    const uniqueProviders = [...new Set(appointments.map(apt => apt.provider))];
    return uniqueProviders.sort();
  }, [appointments]);

  // Filter and sort appointments
  const filteredAppointments = useMemo(() => {
    let filtered = appointments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(apt => 
        apt.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === filterStatus);
    }

    // Provider filter
    if (filterProvider !== 'all') {
      filtered = filtered.filter(apt => apt.provider === filterProvider);
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date':
          comparison = new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime();
          break;
        case 'service':
          comparison = a.service.localeCompare(b.service);
          break;
        case 'provider':
          comparison = a.provider.localeCompare(b.provider);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [appointments, searchTerm, filterStatus, filterProvider, sortBy, sortOrder]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'no-show':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case 'upcoming':
        return <Clock className="w-4 h-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800';
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const isExpanded = expandedId === appointment.id;

    return (
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div 
          className="p-4 cursor-pointer"
          onClick={() => setExpandedId(isExpanded ? null : appointment.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-medium text-gray-900">{appointment.service}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                  {getStatusIcon(appointment.status)}
                  <span className="ml-1 capitalize">{appointment.status}</span>
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(`${appointment.date} ${appointment.time}`).toLocaleDateString('en-US', { 
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{appointment.time} ({appointment.duration} min)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{appointment.provider}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span>{appointment.location}</span>
                </div>
              </div>

              {appointment.rating && (
                <div className="flex items-center space-x-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < appointment.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2 ml-4">
              <span className="text-lg font-medium text-gray-900">${appointment.price}</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="space-y-3">
              {appointment.notes && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Notes</h4>
                  <p className="text-sm text-gray-600">{appointment.notes}</p>
                </div>
              )}

              {appointment.review && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Review</h4>
                  <p className="text-sm text-gray-600">{appointment.review}</p>
                </div>
              )}

              <div className="flex flex-wrap gap-2 pt-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails(appointment);
                  }}
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <FileText className="w-4 h-4 inline mr-1" />
                  View Details
                </button>

                {appointment.rebookable && appointment.status !== 'upcoming' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRebook(appointment);
                    }}
                    className="px-4 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <RefreshCw className="w-4 h-4 inline mr-1" />
                    Rebook
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Appointment History</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onExport('csv')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Download className="w-4 h-4 inline mr-1" />
              Export CSV
            </button>
            <button
              onClick={() => onExport('pdf')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Download className="w-4 h-4 inline mr-1" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4 inline mr-1" />
              Filters
              <ChevronDown className={`w-4 h-4 inline ml-1 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No Show</option>
                  <option value="upcoming">Upcoming</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Provider
                </label>
                <select
                  value={filterProvider}
                  onChange={(e) => setFilterProvider(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Providers</option>
                  {providers.map(provider => (
                    <option key={provider} value={provider}>{provider}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sort By
                </label>
                <div className="flex space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="date">Date</option>
                    <option value="service">Service</option>
                    <option value="provider">Provider</option>
                  </select>
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {sortOrder === 'asc' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Appointment List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No appointments found</p>
            </div>
          ) : (
            filteredAppointments.map(appointment => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">Total Appointments</p>
            <p className="text-2xl font-semibold text-gray-900">{appointments.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600">Completed</p>
            <p className="text-2xl font-semibold text-green-900">
              {appointments.filter(a => a.status === 'completed').length}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600">Total Spent</p>
            <p className="text-2xl font-semibold text-blue-900">
              ${appointments.filter(a => a.status === 'completed').reduce((sum, a) => sum + a.price, 0)}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-yellow-600">Average Rating</p>
            <p className="text-2xl font-semibold text-yellow-900">
              {(appointments.filter(a => a.rating).reduce((sum, a) => sum + (a.rating || 0), 0) / 
                appointments.filter(a => a.rating).length || 0).toFixed(1)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick Rebook Component
export const QuickRebook: React.FC<{ 
  appointment: Appointment;
  onConfirm: (date: string, time: string) => void;
  onCancel: () => void;
}> = ({ appointment, onConfirm, onCancel }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots] = useState([
    '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
  ]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Rebook Appointment
      </h3>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-900 font-medium">{appointment.service}</p>
        <p className="text-sm text-blue-700">with {appointment.provider}</p>
        <p className="text-sm text-blue-700">{appointment.duration} minutes - ${appointment.price}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Time
            </label>
            <div className="grid grid-cols-3 gap-2">
              {availableSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    selectedTime === slot
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-3 pt-4">
          <button
            onClick={() => onConfirm(selectedDate, selectedTime)}
            disabled={!selectedDate || !selectedTime}
            className={`flex-1 py-2 px-4 rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              selectedDate && selectedTime
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Confirm Rebooking
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2 px-4 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};