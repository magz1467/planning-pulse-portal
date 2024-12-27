import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Replace these two lines with your copied values:
const supabaseUrl = 'YOUR_PROJECT_URL_HERE';
const supabaseAnonKey = 'YOUR_ANON_PUBLIC_KEY_HERE';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});