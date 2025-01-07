import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://jposqxdboetyioymfswd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impwb3NxeGRib2V0eWlveW1mc3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ2NTQ0MDAsImV4cCI6MjAyMDIzMDQwMH0.GtB8fKnqwxMhGxZxnGZXh0x_a_O_FcXOhZ9X-HSF_YY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true
  }
});