import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://jposqxdboetyioymfswd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impwb3NxeGRib2V0eWlveW1mc3dkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDI5MzIxNjAsImV4cCI6MjAxODUwODE2MH0.SbUXk3ow4l1gBVqbQbxWCgNlUVNOBb-uHHGYDvnNQpk';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});