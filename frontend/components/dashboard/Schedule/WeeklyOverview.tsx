import React, { useState, useEffect } from 'react';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay,
  addWeeks,
  subWeeks
} from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Clock, Users } from 'lucide-react';

interface DayAppointment {
  id: string;
  time: string;
  patientName: string;
  type: 'TMJ' | 'Implants' | 'Cosmetic' | 'General' | 'Emergency';
  duration: number;
}

interface DayOverview {
  date: Date;
  appointments: DayAppointment[];
  totalAppointments: number;
  availableSlots: number;
}

const WeeklyOverview: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [weekData, setWeekData] = useState<DayOverview[]>([]);

  useEffect(() => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const end = endOfWeek(currentWeek, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    setWeekDays(days);

    // Mock data - replace with actual API call
    const mockData: DayOverview[] = days.map(day => ({
      date: day,
      appointments: generateMockAppointments(day),
      totalAppointments: Math.floor(Math.random() * 15) + 5,
      availableSlots: Math.floor(Math.random() * 10) + 2
    }));
    setWeekData(mockData);
  }, [currentWeek]);

  const generateMockAppointments = (date: Date): DayAppointment[] => {
    const types: Array<'TMJ' | 'Implants' | 'Cosmetic' | 'General' | 'Emergency'> = 
      ['TMJ', 'Implants', 'Cosmetic', 'General', 'Emergency'];
    const count = Math.floor(Math.random() * 5) + 3;
    
    return Array.from({ length: count }, (_, i) => ({
      id: `${date.getTime()}-${i}`,
      time: `${9 + i * 2}:00 AM`,
      patientName: `Patient ${i + 1}`,
      type: types[Math.floor(Math.random() * types.length)],
      duration: [30, 60, 90, 120][Math.floor(Math.random() * 4)]
    }));
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'TMJ': 'bg-purple-500',
      'Implants': 'bg-blue-500',
      'Cosmetic': 'bg-pink-500',
      'General': 'bg-green-500',
      'Emergency': 'bg-red-500'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-500';
  };

  const navigateWeek = (direction: number) => {
    setCurrentWeek(direction > 0 ? addWeeks(currentWeek, 1) : subWeeks(currentWeek, 1));
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Luxury Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-light tracking-wide">Weekly Overview</h2>
              <p className="text-sm text-gray-300 mt-1">
                {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          
          {/* Week Navigation */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateWeek(-1)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentWeek(new Date())}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all text-sm"
            >
              This Week
            </button>
            <button
              onClick={() => navigateWeek(1)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Week Grid */}
      <div className="grid grid-cols-7 divide-x divide-gray-200">
        {weekData.map((day, index) => {
          const isToday = isSameDay(day.date, new Date());
          
          return (
            <div
              key={index}
              className={`min-h-[400px] ${
                isToday ? 'bg-blue-50/30' : 'bg-white'
              } hover:bg-gray-50 transition-colors`}
            >
              {/* Day Header */}
              <div className={`p-4 border-b ${
                isToday ? 'bg-blue-100/50 border-blue-200' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider">
                      {format(day.date, 'EEE')}
                    </p>
                    <p className={`text-2xl font-light ${
                      isToday ? 'text-blue-600' : 'text-gray-800'
                    }`}>
                      {format(day.date, 'd')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {day.availableSlots} slots
                    </p>
                    <p className="text-sm font-medium text-gray-700">
                      {day.totalAppointments} appts
                    </p>
                  </div>
                </div>
              </div>

              {/* Appointments */}
              <div className="p-2 space-y-1 overflow-y-auto max-h-[300px]">
                {day.appointments.slice(0, 4).map((apt) => (
                  <div
                    key={apt.id}
                    className="group relative overflow-hidden rounded-lg bg-gray-50 hover:bg-gray-100 transition-all cursor-pointer"
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${getTypeColor(apt.type)}`} />
                    <div className="pl-3 pr-2 py-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-gray-800">{apt.time}</p>
                        <p className="text-xs text-gray-500">{apt.duration}m</p>
                      </div>
                      <p className="text-xs text-gray-600 truncate mt-1">
                        {apt.patientName}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{apt.type}</p>
                    </div>
                  </div>
                ))}
                
                {day.appointments.length > 4 && (
                  <button className="w-full py-2 text-xs text-blue-600 hover:text-blue-700 font-medium">
                    +{day.appointments.length - 4} more
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <p className="text-sm text-gray-600">Appointment Types:</p>
            {['TMJ', 'Implants', 'Cosmetic', 'General', 'Emergency'].map(type => (
              <div key={type} className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getTypeColor(type)}`} />
                <span className="text-xs text-gray-600">{type}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>Total Week: {weekData.reduce((sum, day) => sum + day.totalAppointments, 0)} appointments</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeeklyOverview;