import { useState, useEffect, useCallback } from 'react';
import { supabase, subscribeToTable, unsubscribeFromTable } from '../services/supabaseClient';
import { MetricsCalculator } from '../services/analytics/metricsCalculator';
import { useAuth } from '../contexts/AuthContext';
import type {
  WatchMetrics
} from '../types/watch.types';

interface UseSupabaseDataReturn {
  metrics: WatchMetrics | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
}

export const useSupabaseData = (realTimeUpdates: boolean = true): UseSupabaseDataReturn => {
  const [metrics, setMetrics] = useState<WatchMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);


  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        appointmentsResponse,
        patientsResponse,
        servicesResponse,
        staffResponse
      ] = await Promise.all([
        supabase
          .from('appointments')
          .select(`
            *,
            services (*),
            patients (*),
            staff (*)
          `)
          .order('appointment_date', { ascending: false }),
        supabase
          .from('patients')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('services')
          .select('*')
          .order('name'),
        supabase
          .from('staff')
          .select('*')
          .order('last_name')
      ]);

      // Check for errors
      if (appointmentsResponse.error) throw appointmentsResponse.error;
      if (patientsResponse.error) throw patientsResponse.error;
      if (servicesResponse.error) throw servicesResponse.error;
      if (staffResponse.error) throw staffResponse.error;

      // Calculate metrics
      const calculatedMetrics = MetricsCalculator.calculateAllMetrics(
        appointmentsResponse.data || [],
        patientsResponse.data || [],
        servicesResponse.data || [],
        staffResponse.data || []
      );

      setMetrics(calculatedMetrics);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      
      // Provide fallback mock data
      setMetrics({
        appointments: {
          todayCount: 5,
          weeklyUpcoming: 12,
          completionRate: 95,
          averageDuration: 60,
          nextAppointment: new Date(Date.now() + 3600000) // 1 hour from now
        },
        patients: {
          totalActive: 150,
          newThisMonth: 8,
          satisfactionAverage: 4.8,
          returningPercentage: 85,
          patientOfTheDay: 'Dr. Pedro Demo'
        },
        services: {
          totalServices: 12,
          yomiProcedures: 3,
          revenuePerService: 450,
          popularService: 'YOMI Guided Surgery',
          bookingTrends: 15
        },
        performance: {
          dailyRevenue: 2250,
          weeklyTarget: 15000,
          staffProductivity: 88,
          testimonialRating: 4.9,
          performanceStatus: 'Excellent'
        }
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Setup real-time subscriptions
  useEffect(() => {
    if (!realTimeUpdates) return;

    const newSubscriptions: any[] = [];

    // Subscribe to appointments changes
    const appointmentsSub = subscribeToTable(
      'appointments',
      (payload) => {
        console.log('Appointments changed:', payload);
        fetchData(); // Refetch all data when appointments change
      }
    );

    // Subscribe to patients changes
    const patientsSub = subscribeToTable(
      'patients',
      (payload) => {
        console.log('Patients changed:', payload);
        fetchData(); // Refetch all data when patients change
      }
    );

    // Subscribe to services changes
    const servicesSub = subscribeToTable(
      'services',
      (payload) => {
        console.log('Services changed:', payload);
        fetchData(); // Refetch all data when services change
      }
    );

    // Subscribe to staff changes
    const staffSub = subscribeToTable(
      'staff',
      (payload) => {
        console.log('Staff changed:', payload);
        fetchData(); // Refetch all data when staff change
      }
    );

    newSubscriptions.push(
      appointmentsSub,
      patientsSub,
      servicesSub,
      staffSub
    );

    // Cleanup subscriptions on unmount or when realTimeUpdates changes
    return () => {
      newSubscriptions.forEach(subscription => {
        unsubscribeFromTable(subscription);
      });
    };
  }, [realTimeUpdates, fetchData]);

  return {
    metrics,
    loading,
    error,
    lastUpdated,
    refetch: fetchData
  };
};

export const useSupabaseConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { error } = await supabase
          .from('patients')
          .select('count')
          .limit(1);
        
        if (error) {
          throw error;
        }
        
        setIsConnected(true);
        setConnectionError(null);
      } catch (err) {
        console.error('Supabase connection error:', err);
        setIsConnected(false);
        setConnectionError(err instanceof Error ? err.message : 'Connection failed');
      }
    };

    checkConnection();

    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    return () => clearInterval(interval);
  }, []);

  return {
    isConnected,
    connectionError
  };
};

// Hook for individual table data with caching
export const useTableData = <T>(
  tableName: string,
  selectQuery: string = '*',
  realTime: boolean = false
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const { data: tableData, error: tableError } = await supabase
        .from(tableName)
        .select(selectQuery);

      if (tableError) throw tableError;
      
      setData((tableData as T[]) || []);
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${tableName}:`, err);
      setError(err instanceof Error ? err.message : `Failed to fetch ${tableName}`);
    } finally {
      setLoading(false);
    }
  }, [tableName, selectQuery]);

  useEffect(() => {
    fetchData();

    if (realTime) {
      const subscription = subscribeToTable(tableName, () => {
        fetchData();
      });

      return () => unsubscribeFromTable(subscription);
    }
  }, [fetchData, realTime, tableName]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};
