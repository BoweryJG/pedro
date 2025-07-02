import React, { useState, useEffect } from 'react';
import { 
  format, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  addWeeks,
  subWeeks,
  isSameDay,
  setHours,
  setMinutes
} from 'date-fns';
import { 
  Users, 
  Calendar, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  Plus,
  Edit2,
  Trash2,
  Coffee,
  AlertCircle
} from 'lucide-react';

interface StaffMember {
  id: string;
  name: string;
  role: 'Dentist' | 'Hygienist' | 'Assistant' | 'Receptionist';
  avatar?: string;
  color: string;
}

interface Shift {
  id: string;
  staffId: string;
  date: Date;
  startTime: string;
  endTime: string;
  breakStart?: string;
  breakEnd?: string;
  type: 'regular' | 'overtime' | 'on-call';
}

interface TimeOff {
  id: string;
  staffId: string;
  startDate: Date;
  endDate: Date;
  reason: string;
  status: 'pending' | 'approved' | 'declined';
}

const StaffScheduler: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [timeOffs, setTimeOffs] = useState<TimeOff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string | null>(null);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [editingShift, setEditingShift] = useState<Shift | null>(null);

  useEffect(() => {
    const start = startOfWeek(currentWeek, { weekStartsOn: 1 });
    const end = endOfWeek(currentWeek, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });
    setWeekDays(days);
  }, [currentWeek]);

  // Mock data - replace with actual API calls
  useEffect(() => {
    setStaff([
      {
        id: '1',
        name: 'Dr. Pedro',
        role: 'Dentist',
        color: 'bg-blue-500'
      },
      {
        id: '2',
        name: 'Dr. Sarah Chen',
        role: 'Dentist',
        color: 'bg-purple-500'
      },
      {
        id: '3',
        name: 'Maria Rodriguez',
        role: 'Hygienist',
        color: 'bg-green-500'
      },
      {
        id: '4',
        name: 'James Wilson',
        role: 'Assistant',
        color: 'bg-yellow-500'
      },
      {
        id: '5',
        name: 'Emma Thompson',
        role: 'Receptionist',
        color: 'bg-pink-500'
      }
    ]);

    // Generate mock shifts
    const mockShifts: Shift[] = [];
    weekDays.forEach(day => {
      staff.forEach(member => {
        if (Math.random() > 0.3 && !isSameDay(day, new Date(2024, 0, 6)) && !isSameDay(day, new Date(2024, 0, 7))) {
          mockShifts.push({
            id: `${day.getTime()}-${member.id}`,
            staffId: member.id,
            date: day,
            startTime: member.role === 'Dentist' ? '08:00' : '08:30',
            endTime: member.role === 'Dentist' ? '18:00' : '17:30',
            breakStart: '12:00',
            breakEnd: '13:00',
            type: 'regular'
          });
        }
      });
    });
    setShifts(mockShifts);
  }, [weekDays]);

  const navigateWeek = (direction: number) => {
    setCurrentWeek(direction > 0 ? addWeeks(currentWeek, 1) : subWeeks(currentWeek, 1));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'Dentist':
        return '👨‍⚕️';
      case 'Hygienist':
        return '🦷';
      case 'Assistant':
        return '🩺';
      case 'Receptionist':
        return '📋';
      default:
        return '👤';
    }
  };

  const getShiftForStaffAndDay = (staffId: string, day: Date) => {
    return shifts.find(shift => 
      shift.staffId === staffId && isSameDay(shift.date, day)
    );
  };

  const handleShiftClick = (shift: Shift) => {
    setEditingShift(shift);
    setShowShiftModal(true);
  };

  const handleAddShift = (staffId: string, day: Date) => {
    setSelectedStaff(staffId);
    setEditingShift({
      id: '',
      staffId,
      date: day,
      startTime: '09:00',
      endTime: '17:00',
      type: 'regular'
    });
    setShowShiftModal(true);
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Luxury Header */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-light tracking-wide">Staff Scheduler</h2>
              <p className="text-sm text-gray-300 mt-1">Team Excellence Management</p>
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
            <div className="px-4 py-2 bg-white/10 rounded-lg">
              <p className="text-sm">
                {format(weekDays[0], 'MMM d')} - {format(weekDays[6], 'MMM d, yyyy')}
              </p>
            </div>
            <button
              onClick={() => navigateWeek(1)}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 w-48">
                Staff Member
              </th>
              {weekDays.map((day, index) => (
                <th key={index} className="px-2 py-4 text-center text-sm font-medium text-gray-700 min-w-[140px]">
                  <div>
                    <p className="text-xs text-gray-500">{format(day, 'EEE')}</p>
                    <p className={`text-lg ${isSameDay(day, new Date()) ? 'text-blue-600 font-semibold' : ''}`}>
                      {format(day, 'd')}
                    </p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {staff.map(member => (
              <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full ${member.color} flex items-center justify-center text-white text-lg`}>
                      {getRoleIcon(member.role)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{member.name}</p>
                      <p className="text-sm text-gray-500">{member.role}</p>
                    </div>
                  </div>
                </td>
                {weekDays.map((day, index) => {
                  const shift = getShiftForStaffAndDay(member.id, day);
                  const isToday = isSameDay(day, new Date());
                  
                  return (
                    <td
                      key={index}
                      className={`px-2 py-4 text-center ${
                        isToday ? 'bg-blue-50/30' : ''
                      }`}
                    >
                      {shift ? (
                        <div
                          onClick={() => handleShiftClick(shift)}
                          className={`${member.color} bg-opacity-10 border ${member.color} border-opacity-30 rounded-lg p-2 cursor-pointer hover:bg-opacity-20 transition-all`}
                        >
                          <p className="text-xs font-medium text-gray-800">
                            {shift.startTime} - {shift.endTime}
                          </p>
                          {shift.breakStart && (
                            <div className="flex items-center justify-center mt-1 text-gray-600">
                              <Coffee className="w-3 h-3 mr-1" />
                              <span className="text-xs">{shift.breakStart}</span>
                            </div>
                          )}
                          {shift.type === 'overtime' && (
                            <span className="text-xs text-orange-600 font-medium">OT</span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAddShift(member.id, day)}
                          className="w-full h-full min-h-[60px] border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all flex items-center justify-center group"
                        >
                          <Plus className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Total Hours: <span className="font-semibold text-gray-800">
                  {shifts.reduce((acc, shift) => {
                    const start = parseInt(shift.startTime.split(':')[0]);
                    const end = parseInt(shift.endTime.split(':')[0]);
                    return acc + (end - start);
                  }, 0)}h
                </span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Staff Coverage: <span className="font-semibold text-green-600">Good</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">
                Time Off Requests: <span className="font-semibold text-yellow-600">2 Pending</span>
              </span>
            </div>
          </div>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium">
            Export Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffScheduler;