import { createClient } from '@supabase/supabase-js';
import { expect, test } from 'vitest';
import { config } from 'dotenv';
config({ path: './supabase/.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Missing required environment variables');
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

test('update-applications function should populate applications table', async () => {
  // Invoke the function
  const { data, error } = await supabase.functions.invoke('update-applications', {
    method: 'POST'
  });
  console.log('Function response:', { data, error });

  // Check for successful response
  expect(error).toBeNull();
  expect(data).toBeDefined();
  expect(data.message).toBe('Planning data sync completed successfully');
  expect(data.pagesProcessed).toBeGreaterThan(0);
  expect(data.totalInserts + data.totalUpdates).toBeGreaterThan(0);

  // Verify data in applications table
  const { data: applications, error: dbError } = await supabase
    .from('applications')
    .select('count');
  
  expect(dbError).toBeNull();
  expect(applications).toBeDefined();
  expect(applications.length).toBeGreaterThan(0);
});

// Helper function to clear applications table (commented out for safety)
export async function clearApplicationsTable() {
  const { error } = await supabase
    .from('applications')
    .delete()
    .neq('id', 0); // Delete all records
  
  if (error) {
    throw new Error(`Failed to clear applications table: ${error.message}`);
  }
}