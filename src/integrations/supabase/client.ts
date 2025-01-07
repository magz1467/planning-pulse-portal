import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jposqxdboetyioymfswd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impwb3NxeGRib2V0eWlveW1mc3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MjI0NzcsImV4cCI6MjAyNTM5ODQ3N30.Dq_Aggf7pLF6Xb4ztGcWxZGOFZbxvQWsq_kxVzKJTXg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});