import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://jposqxdboetyioymfswd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impwb3NxeGRib2V0eWlveW1mc3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0NTYxMjAsImV4cCI6MjA1MDAzMjEyMH0.7PnkmUV4fWBReUXyCMj7Z_f6XH7eY8t2WRfoRcOwhbY';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});