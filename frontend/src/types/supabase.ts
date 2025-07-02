export type Tables = {
  patients: {
    Row: {
      id: string;
      auth_user_id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string | null;
      date_of_birth: string | null;
      address: string | null;
      medical_history: any | null;
      insurance_provider: string | null;
      insurance_member_id: string | null;
      insurance_group_number: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: Omit<Tables['patients']['Row'], 'id' | 'created_at' | 'updated_at'>;
    Update: Partial<Tables['patients']['Insert']>;
  };
  services: {
    Row: {
      id: string;
      name: string;
      description: string;
      category: string;
      estimated_duration: string | null;
      price_range: any | null;
      image_url: string | null;
      is_yomi_technology: boolean;
      created_at: string;
      updated_at: string;
    };
  };
  staff: {
    Row: {
      id: string;
      first_name: string;
      last_name: string;
      title: string;
      specialization: string | null;
      bio: string | null;
      image_url: string | null;
      created_at: string;
      updated_at: string;
    };
  };
  appointments: {
    Row: {
      id: string;
      patient_id: string;
      service_id: string;
      staff_id: string | null;
      appointment_date: string;
      appointment_time: string;
      duration: string | null;
      status: 'scheduled' | 'completed' | 'cancelled';
      notes: string | null;
      confirmation_code: string | null;
      reminder_sent: boolean;
      confirmed_at: string | null;
      cancelled_at: string | null;
      cancellation_reason: string | null;
      created_at: string;
      updated_at: string;
    };
    Insert: Omit<Tables['appointments']['Row'], 'id' | 'created_at' | 'updated_at' | 'reminder_sent'> & {
      reminder_sent?: boolean;
    };
    Update: Partial<Tables['appointments']['Insert']>;
  };
  provider_availability: {
    Row: {
      id: string;
      staff_id: string;
      day_of_week: number;
      start_time: string;
      end_time: string;
      is_active: boolean;
      created_at: string;
      updated_at: string;
    };
  };
  provider_time_slots: {
    Row: {
      id: string;
      staff_id: string;
      date: string;
      start_time: string;
      end_time: string;
      is_available: boolean;
      appointment_id: string | null;
      created_at: string;
      updated_at: string;
    };
  };
};