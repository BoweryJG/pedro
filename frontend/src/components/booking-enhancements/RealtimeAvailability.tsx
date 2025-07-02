import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Clock, 
  Users, 
  Calendar,
  AlertCircle,
  CheckCircle,
  Loader,
  Activity
} from 'lucide-react';

interface TimeSlot {
  time: string;
  available: boolean;
  bookedBy?: string;
  providerId: string;
  capacity: number;
  currentBookings: number;
}

interface AvailabilityUpdate {
  type: 'slot_booked' | 'slot_released' | 'provider_update' | 'system_update';
  providerId: string;
  date: string;
  time?: string;
  data?: any;
  timestamp: number;
}

interface RealtimeAvailabilityProps {
  providerId: string;
  serviceId: string;
  selectedDate: string;
  onSlotSelect: (slot: TimeSlot) => void;
  maxCapacity?: number;
}

interface WebSocketStatus {
  connected: boolean;
  reconnecting: boolean;
  lastUpdate: Date | null;
  error: string | null;
}

export const RealtimeAvailability: React.FC<RealtimeAvailabilityProps> = ({
  providerId,
  serviceId,
  selectedDate,
  onSlotSelect,
  maxCapacity = 1,
}) => {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [wsStatus, setWsStatus] = useState<WebSocketStatus>({
    connected: false,
    reconnecting: false,
    lastUpdate: null,
    error: null,
  });
  const [recentUpdates, setRecentUpdates] = useState<AvailabilityUpdate[]>([]);
  const [viewersCount, setViewersCount] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  // Initialize time slots
  useEffect(() => {
    const generateTimeSlots = () => {
      const startHour = 9;
      const endHour = 17;
      const interval = 30; // minutes
      const generatedSlots: TimeSlot[] = [];

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += interval) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
          generatedSlots.push({
            time,
            available: Math.random() > 0.3, // Simulate some booked slots
            providerId,
            capacity: maxCapacity,
            currentBookings: Math.floor(Math.random() * maxCapacity),
          });
        }
      }

      setSlots(generatedSlots);
      setLoading(false);
    };

    generateTimeSlots();
  }, [providerId, selectedDate, maxCapacity]);

  // WebSocket connection management
  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/availability`;

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket connected');
        setWsStatus(prev => ({
          ...prev,
          connected: true,
          reconnecting: false,
          error: null,
        }));
        reconnectAttemptsRef.current = 0;

        // Subscribe to updates for this provider and date
        wsRef.current?.send(JSON.stringify({
          type: 'subscribe',
          providerId,
          serviceId,
          date: selectedDate,
        }));
      };

      wsRef.current.onmessage = (event) => {
        try {
          const update: AvailabilityUpdate = JSON.parse(event.data);
          handleAvailabilityUpdate(update);
          
          setWsStatus(prev => ({
            ...prev,
            lastUpdate: new Date(),
          }));
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setWsStatus(prev => ({
          ...prev,
          error: 'Connection error',
        }));
      };

      wsRef.current.onclose = () => {
        console.log('WebSocket disconnected');
        setWsStatus(prev => ({
          ...prev,
          connected: false,
        }));

        // Attempt to reconnect with exponential backoff
        if (reconnectAttemptsRef.current < 5) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
          reconnectAttemptsRef.current++;
          
          setWsStatus(prev => ({
            ...prev,
            reconnecting: true,
          }));

          reconnectTimeoutRef.current = setTimeout(() => {
            connectWebSocket();
          }, delay);
        }
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      setWsStatus(prev => ({
        ...prev,
        error: 'Failed to connect',
      }));
    }
  }, [providerId, serviceId, selectedDate]);

  // Handle real-time updates
  const handleAvailabilityUpdate = (update: AvailabilityUpdate) => {
    // Update slots based on the update type
    switch (update.type) {
      case 'slot_booked':
        setSlots(prev => prev.map(slot => 
          slot.time === update.time
            ? { 
                ...slot, 
                available: slot.currentBookings + 1 < slot.capacity,
                currentBookings: slot.currentBookings + 1 
              }
            : slot
        ));
        break;

      case 'slot_released':
        setSlots(prev => prev.map(slot => 
          slot.time === update.time
            ? { 
                ...slot, 
                available: true,
                currentBookings: Math.max(0, slot.currentBookings - 1)
              }
            : slot
        ));
        break;

      case 'provider_update':
        // Handle provider availability changes
        if (update.data?.slots) {
          setSlots(update.data.slots);
        }
        break;

      case 'system_update':
        // Handle system-wide updates
        if (update.data?.viewersCount !== undefined) {
          setViewersCount(update.data.viewersCount);
        }
        break;
    }

    // Add to recent updates
    setRecentUpdates(prev => [update, ...prev].slice(0, 5));
  };

  // Connect WebSocket on mount
  useEffect(() => {
    connectWebSocket();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [connectWebSocket]);

  // Manual refresh
  const handleRefresh = () => {
    setLoading(true);
    // Simulate fetching fresh data
    setTimeout(() => {
      setLoading(false);
      setWsStatus(prev => ({
        ...prev,
        lastUpdate: new Date(),
      }));
    }, 1000);
  };

  const handleSlotClick = (slot: TimeSlot) => {
    if (!slot.available) return;
    
    setSelectedSlot(slot.time);
    onSlotSelect(slot);

    // Send selection to other viewers
    wsRef.current?.send(JSON.stringify({
      type: 'slot_selected',
      providerId,
      date: selectedDate,
      time: slot.time,
    }));
  };

  const ConnectionStatus = () => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        {wsStatus.connected ? (
          <>
            <Wifi className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-700">Live updates active</span>
          </>
        ) : wsStatus.reconnecting ? (
          <>
            <Loader className="w-4 h-4 text-yellow-500 animate-spin" />
            <span className="text-sm text-yellow-700">Reconnecting...</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">Offline</span>
          </>
        )}
        
        {wsStatus.lastUpdate && (
          <span className="text-xs text-gray-500">
            Last update: {wsStatus.lastUpdate.toLocaleTimeString()}
          </span>
        )}
      </div>

      <div className="flex items-center space-x-3">
        {viewersCount > 1 && (
          <span className="text-sm text-gray-600">
            <Users className="w-4 h-4 inline mr-1" />
            {viewersCount} viewing
          </span>
        )}
        
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );

  const RecentActivity = () => {
    if (recentUpdates.length === 0) return null;

    return (
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
          <Activity className="w-4 h-4 mr-1" />
          Recent Activity
        </h4>
        <div className="space-y-1">
          {recentUpdates.map((update, index) => (
            <div key={index} className="text-xs text-blue-700">
              {update.type === 'slot_booked' && `Slot ${update.time} was just booked`}
              {update.type === 'slot_released' && `Slot ${update.time} is now available`}
              {update.type === 'provider_update' && 'Provider availability updated'}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Available Time Slots
          </h3>
          <div className="text-sm text-gray-600">
            {selectedDate}
          </div>
        </div>

        <ConnectionStatus />

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mt-4">
              {slots.map((slot) => {
                const isSelected = selectedSlot === slot.time;
                const isAvailable = slot.available && slot.currentBookings < slot.capacity;
                const isAlmostFull = slot.capacity > 1 && slot.currentBookings >= slot.capacity * 0.8;

                return (
                  <button
                    key={slot.time}
                    onClick={() => handleSlotClick(slot)}
                    disabled={!isAvailable}
                    className={`
                      relative p-3 rounded-lg text-sm font-medium transition-all
                      ${isSelected 
                        ? 'bg-blue-600 text-white ring-2 ring-blue-600 ring-offset-2' 
                        : isAvailable 
                          ? isAlmostFull
                            ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border border-yellow-200'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }
                    `}
                  >
                    <div>{slot.time}</div>
                    {slot.capacity > 1 && (
                      <div className={`text-xs mt-1 ${isSelected ? 'text-blue-100' : 'text-gray-500'}`}>
                        {slot.capacity - slot.currentBookings}/{slot.capacity} available
                      </div>
                    )}
                    
                    {/* Real-time indicator */}
                    {slot.currentBookings > 0 && slot.currentBookings < slot.capacity && (
                      <div className="absolute top-1 right-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {selectedSlot && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Selected: {selectedSlot}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedSlot(null)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Change
                </button>
              </div>
            )}

            <RecentActivity />

            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium">Real-time updates enabled</p>
                  <p className="mt-1">
                    Time slots are updated instantly when other users make bookings.
                    {viewersCount > 1 && ` ${viewersCount - 1} other ${viewersCount - 1 === 1 ? 'person is' : 'people are'} currently viewing these slots.`}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// WebSocket Hook for other components
export const useRealtimeAvailability = (providerId: string, date: string) => {
  const [connected, setConnected] = useState(false);
  const [updates, setUpdates] = useState<AvailabilityUpdate[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/availability`;
    
    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setConnected(true);
        wsRef.current?.send(JSON.stringify({
          type: 'subscribe',
          providerId,
          date,
        }));
      };

      wsRef.current.onmessage = (event) => {
        const update = JSON.parse(event.data);
        setUpdates(prev => [...prev, update]);
      };

      wsRef.current.onclose = () => {
        setConnected(false);
      };
    } catch (error) {
      console.error('WebSocket error:', error);
    }

    return () => {
      wsRef.current?.close();
    };
  }, [providerId, date]);

  return { connected, updates };
};