import { createClient } from '@supabase/supabase-js';

// Use the existing Supabase instance from Pedro's lib
export { supabase } from '../lib/supabase';

// Re-export subscription utilities
import { supabase } from '../lib/supabase';

export const subscribeToTable = (
  tableName: string,
  callback: (payload: any) => void
) => {
  const subscription = supabase
    .channel(`public:${tableName}`)
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: tableName },
      callback
    )
    .subscribe();

  return subscription;
};

export const unsubscribeFromTable = (subscription: any) => {
  if (subscription) {
    subscription.unsubscribe();
  }
};