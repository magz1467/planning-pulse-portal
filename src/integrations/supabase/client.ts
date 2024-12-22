import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jposqxdboetyioymfswd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impwb3NxeGRib2V0eWlveW1mc3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MjEwNzgsImV4cCI6MjAyNTM5NzA3OH0.N3UGpylo0CtZvGxHFG8O_vI6HVPJHPDqEjbCyHXNPKc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});