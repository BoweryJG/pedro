import React, { useState } from 'react';
import { useDrag } from 'react-dnd';
import { format, differenceInMinutes } from 'date-fns';
import { 
  Clock, 
  User, 
  Phone, 
  MessageSquare, 
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Stethoscope
} from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  type: 'TMJ' | 'Implants' | 'Cosmetic' | 'General' | 'Emergency';
  startTime: Date;
  endTime: Date;
  status: 'scheduled' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled';
  chairNumber: number;
  notes?: string;
  phoneNumber?: string;
  email?: string;
  lastVisit?: string;
  insurance?: string;
}

interface TimeSlot {
  time: Date;
  appointments: Appointment[];
}

interface AppointmentCardProps {
  appointment: Appointment;
  timeSlots: TimeSlot[];
  onQuickAction?: (action: string, appointment: Appointment) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  timeSlots,
  onQuickAction 
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'appointment',
    item: { id: appointment.id },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  // Calculate position and height
  const slotIndex = timeSlots.findIndex(slot => 
    slot.time.getTime() === appointment.startTime.getTime()
  );
  const duration = differenceInMinutes(appointment.endTime, appointment.startTime);
  const slots = Math.ceil(duration / 15);
  
  const top = slotIndex * 80; // 80px per slot
  const height = slots * 80 - 4; // -4px for border spacing

  const getTypeStyles = () => {
    const styles = {
      'TMJ': {
        bg: 'bg-gradient-to-r from-purple-500 to-purple-600',
        border: 'border-purple-300',
        text: 'text-purple-100',
        icon: '🦷'
      },
      'Implants': {
        bg: 'bg-gradient-to-r from-blue-500 to-blue-600',
        border: 'border-blue-300',
        text: 'text-blue-100',
        icon: '🔧'
      },
      'Cosmetic': {
        bg: 'bg-gradient-to-r from-pink-500 to-pink-600',
        border: 'border-pink-300',
        text: 'text-pink-100',
        icon: '✨'
      },
      'General': {
        bg: 'bg-gradient-to-r from-green-500 to-green-600',
        border: 'border-green-300',
        text: 'text-green-100',
        icon: '🏥'
      },
      'Emergency': {
        bg: 'bg-gradient-to-r from-red-500 to-red-600',
        border: 'border-red-300',
        text: 'text-red-100',
        icon: '🚨'
      }
    };
    return styles[appointment.type] || styles.General;
  };

  const getStatusIcon = () => {
    switch (appointment.status) {
      case 'checked-in':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in-progress':
        return <div className="w-4 h-4 rounded-full bg-yellow-400 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-white" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Clock className="w-4 h-4 text-white/70" />;
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div
      ref={drag}
      style={{ top: `${top}px`, height: `${height}px` }}
      className={`absolute left-1 right-1 rounded-xl shadow-lg overflow-hidden cursor-move transition-all transform ${
        isDragging ? 'opacity-50 scale-95' : 'opacity-100 scale-100 hover:scale-[1.02]'
      } ${typeStyles.bg} ${typeStyles.border} border-2`}
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => {
        setShowDetails(false);
        setShowActions(false);
      }}
    >
      {/* Main Content */}
      <div className={`p-3 h-full flex flex-col ${typeStyles.text}`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{typeStyles.icon}</span>
              <h4 className="font-medium text-white truncate">
                {appointment.patientName}
              </h4>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <Clock className="w-3 h-3" />
              <span className="text-xs text-white/90">
                {format(appointment.startTime, 'h:mm a')} - {format(appointment.endTime, 'h:mm a')}
              </span>
            </div>
            <p className="text-xs mt-1 text-white/80">{appointment.type}</p>
          </div>
          <div className="flex items-center space-x-1">
            {getStatusIcon()}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notes Preview */}
        {appointment.notes && height > 100 && (
          <p className="text-xs text-white/70 mt-2 line-clamp-2">
            {appointment.notes}
          </p>
        )}
      </div>

      {/* Quick Actions Menu */}
      {showActions && (
        <div className="absolute top-8 right-2 bg-white rounded-lg shadow-xl p-2 z-50 min-w-[160px]">
          <button
            onClick={() => onQuickAction?.('call', appointment)}
            className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Call Patient</span>
          </button>
          <button
            onClick={() => onQuickAction?.('sms', appointment)}
            className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Send SMS</span>
          </button>
          <button
            onClick={() => onQuickAction?.('chart', appointment)}
            className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Stethoscope className="w-4 h-4" />
            <span>View Chart</span>
          </button>
          <hr className="my-2" />
          <button
            onClick={() => onQuickAction?.('checkin', appointment)}
            className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Check In</span>
          </button>
          <button
            onClick={() => onQuickAction?.('cancel', appointment)}
            className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <XCircle className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>
      )}

      {/* Hover Details */}
      {showDetails && !showActions && (
        <div className="absolute -right-64 top-0 w-60 bg-white rounded-xl shadow-2xl p-4 z-50 transform transition-all">
          <div className="space-y-3">
            <div>
              <h5 className="font-semibold text-gray-800">{appointment.patientName}</h5>
              <p className="text-sm text-gray-500">ID: {appointment.patientId}</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="w-4 h-4" />
                <span>{appointment.phoneNumber || 'No phone'}</span>
              </div>
              {appointment.email && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <MessageSquare className="w-4 h-4" />
                  <span className="truncate">{appointment.email}</span>
                </div>
              )}
              {appointment.lastVisit && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Last visit: {appointment.lastVisit}</span>
                </div>
              )}
              {appointment.insurance && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{appointment.insurance}</span>
                </div>
              )}
            </div>

            {appointment.notes && (
              <div className="pt-3 border-t">
                <p className="text-xs font-medium text-gray-700 mb-1">Notes:</p>
                <p className="text-xs text-gray-600">{appointment.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;