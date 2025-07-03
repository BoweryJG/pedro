import { supabase } from '../../lib/supabase';

export class RealtimeAggregator {
  private subscriptions: any[] = [];
  private aggregationInterval: NodeJS.Timeout | null = null;

  // Start real-time aggregation
  startAggregation(callback: (data: any) => void, intervalMs: number = 5000) {
    this.stopAggregation(); // Clear any existing interval
    
    // Initial aggregation
    this.aggregateMetrics().then(callback);
    
    // Set up periodic aggregation
    this.aggregationInterval = setInterval(async () => {
      const metrics = await this.aggregateMetrics();
      callback(metrics);
    }, intervalMs);
  }

  // Stop real-time aggregation
  stopAggregation() {
    if (this.aggregationInterval) {
      clearInterval(this.aggregationInterval);
      this.aggregationInterval = null;
    }
  }

  // Subscribe to appointment changes
  subscribeToAppointments(callback: (payload: any) => void) {
    const subscription = supabase
      .channel('appointments-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        callback
      )
      .subscribe();

    this.subscriptions.push(subscription);
    return subscription;
  }

  // Subscribe to patient changes
  subscribeToPatients(callback: (payload: any) => void) {
    const subscription = supabase
      .channel('patients-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'patients' },
        callback
      )
      .subscribe();

    this.subscriptions.push(subscription);
    return subscription;
  }

  // Subscribe to financial transactions
  subscribeToTransactions(callback: (payload: any) => void) {
    const subscription = supabase
      .channel('transactions-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'financial_transactions' },
        callback
      )
      .subscribe();

    this.subscriptions.push(subscription);
    return subscription;
  }

  // Aggregate real-time data
  async aggregateMetrics() {
    const today = new Date().toISOString().split('T')[0];
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Fetch appointments
    const { data: appointments } = await supabase
      .from('appointments')
      .select('*')
      .gte('appointment_date', thirtyDaysAgo.toISOString().split('T')[0]);

    // Fetch patients
    const { data: patients } = await supabase
      .from('patients')
      .select('*');

    // Fetch transactions
    const { data: transactions } = await supabase
      .from('financial_transactions')
      .select('*')
      .gte('transaction_date', thirtyDaysAgo.toISOString().split('T')[0]);

    return {
      appointments: appointments || [],
      patients: patients || [],
      transactions: transactions || [],
      lastUpdated: new Date()
    };
  }

  // Get real-time practice metrics
  async getPracticeMetrics() {
    const data = await this.aggregateMetrics();
    
    // Calculate key metrics
    const todayAppointments = data.appointments.filter(a => 
      a.appointment_date === new Date().toISOString().split('T')[0]
    );

    const metrics = {
      todayAppointments: todayAppointments.length,
      totalPatients: data.patients.length,
      monthlyProduction: data.transactions.reduce((sum, t) => sum + (t.amount || 0), 0),
      newPatientsThisMonth: data.patients.filter(p => {
        const createdDate = new Date(p.created_at);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdDate >= thirtyDaysAgo;
      }).length
    };

    return metrics;
  }

  // Cleanup subscriptions
  unsubscribeAll() {
    this.subscriptions.forEach(sub => {
      supabase.removeChannel(sub);
    });
    this.subscriptions = [];
  }
}