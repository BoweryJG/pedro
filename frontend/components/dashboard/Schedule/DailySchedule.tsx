import React, { useState, useEffect } from 'react';
import { format, addMinutes, startOfDay, endOfDay, isSameMinute } from 'date-fns';
import { Clock, Calendar, User, Phone, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDrop } from 'react-dnd';
import AppointmentCard from './AppointmentCard';

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
}

interface TimeSlot {
  time: Date;
  appointments: Appointment[];
}

const DailySchedule: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);

  // Generate time slots for the day (7 AM to 7 PM)
  useEffect(() => {
    const slots: TimeSlot[] = [];
    const start = new Date(selectedDate);
    start.setHours(7, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(19, 0, 0, 0);

    let current = start;
    while (current <= end) {
      slots.push({
        time: new Date(current),
        appointments: appointments.filter(apt => 
          isSameMinute(apt.startTime, current)
        )
      });
      current = addMinutes(current, 15);
    }
    setTimeSlots(slots);
  }, [selectedDate, appointments]);

  // Mock data - replace with actual API call
  useEffect(() => {
    setAppointments([
      {
        id: '1',
        patientName: 'James Wilson',
        patientId: 'P001',
        type: 'TMJ',
        startTime: new Date(selectedDate.setHours(9, 0, 0, 0)),
        endTime: new Date(selectedDate.setHours(10, 0, 0, 0)),
        status: 'scheduled',
        chairNumber: 1,
        phoneNumber: '+1 (555) 123-4567'
      },
      {
        id: '2',
        patientName: 'Sarah Chen',
        patientId: 'P002',
        type: 'Implants',
        startTime: new Date(selectedDate.setHours(10, 30, 0, 0)),
        endTime: new Date(selectedDate.setHours(12, 0, 0, 0)),
        status: 'checked-in',
        chairNumber: 2,
        phoneNumber: '+1 (555) 987-6543'
      },
      {
        id: '3',
        patientName: 'Michael Rodriguez',
        patientId: 'P003',
        type: 'Cosmetic',
        startTime: new Date(selectedDate.setHours(14, 0, 0, 0)),
        endTime: new Date(selectedDate.setHours(15, 30, 0, 0)),
        status: 'scheduled',
        chairNumber: 1,
        phoneNumber: '+1 (555) 456-7890'
      }
    ]);
  }, [selectedDate]);

  const handleAppointmentMove = (appointmentId: string, newTime: Date) => {
    setAppointments(prev => prev.map(apt => {
      if (apt.id === appointmentId) {
        const duration = apt.endTime.getTime() - apt.startTime.getTime();
        return {
          ...apt,
          startTime: newTime,
          endTime: new Date(newTime.getTime() + duration)
        };
      }
      return apt;
    }));
  };

  const navigateDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-2xl overflow-hidden">
      {/* Luxury Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-light tracking-wide">Daily Schedule</h2>
              <p className="text-sm text-gray-300 mt-1">Precision Time Management</p>
            </div>
          </div>
          
          {/* Date Navigation */}
          <div className="flex items-center space-x-4 bg-white/10 rounded-xl p-2 backdrop-blur-sm">
            <button
              onClick={() => navigateDate(-1)}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-4 py-2">
              <p className="text-lg font-medium">{format(selectedDate, 'EEEE')}</p>
              <p className="text-sm text-gray-300">{format(selectedDate, 'MMMM d, yyyy')}</p>
            </div>
            <button
              onClick={() => navigateDate(1)}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="flex h-[calc(100%-8rem)]">
        {/* Time Column */}
        <div className="w-24 bg-gray-100 border-r border-gray-200">
          <div className="sticky top-0 bg-gray-100 z-10 h-12 border-b border-gray-200"></div>
          {timeSlots.map((slot, index) => (
            <div
              key={index}
              className="h-20 border-b border-gray-200 px-2 py-1 text-right"
            >
              {index % 4 === 0 && (
                <span className="text-sm font-medium text-gray-700">
                  {format(slot.time, 'h:mm a')}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Chair Columns */}
        <div className="flex-1 flex">
          {[1, 2, 3].map(chairNumber => (
            <ChairColumn
              key={chairNumber}
              chairNumber={chairNumber}
              timeSlots={timeSlots}
              appointments={appointments.filter(apt => apt.chairNumber === chairNumber)}
              onAppointmentMove={handleAppointmentMove}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface ChairColumnProps {
  chairNumber: number;
  timeSlots: TimeSlot[];
  appointments: Appointment[];
  onAppointmentMove: (appointmentId: string, newTime: Date) => void;
}

const ChairColumn: React.FC<ChairColumnProps> = ({
  chairNumber,
  timeSlots,
  appointments,
  onAppointmentMove
}) => {
  return (
    <div className="flex-1 border-r border-gray-200 last:border-r-0">
      <div className="sticky top-0 bg-white z-10 h-12 border-b border-gray-200 flex items-center justify-center">
        <h3 className="font-medium text-gray-800">Chair {chairNumber}</h3>
      </div>
      <div className="relative">
        {timeSlots.map((slot, index) => (
          <TimeSlotCell
            key={index}
            slot={slot}
            chairNumber={chairNumber}
            onDrop={(appointmentId) => onAppointmentMove(appointmentId, slot.time)}
          />
        ))}
        {appointments.map(appointment => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            timeSlots={timeSlots}
          />
        ))}
      </div>
    </div>
  );
};

interface TimeSlotCellProps {
  slot: TimeSlot;
  chairNumber: number;
  onDrop: (appointmentId: string) => void;
}

const TimeSlotCell: React.FC<TimeSlotCellProps> = ({ slot, chairNumber, onDrop }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'appointment',
    drop: (item: { id: string }) => {
      onDrop(item.id);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));

  return (
    <div
      ref={drop}
      className={`h-20 border-b border-gray-100 transition-all ${
        isOver ? 'bg-blue-50' : ''
      }`}
    />
  );
};

export default DailySchedule;