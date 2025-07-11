// import { createClient } from '@supabase/supabase-js'; // Unused import

// Use the existing Supabase instance from Pedro's lib
export { supabase } from '../lib/supabase';

// Re-export subscription utilities
import { supabase } from '../lib/supabase';

export const subscribeToTable = (
  tableName: string,
  callback: (payload: unknown) => void
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

export const unsubscribeFromTable = (subscription: ReturnType<typeof subscribeToTable>) => {
  if (subscription) {
    subscription.unsubscribe();
  }
};