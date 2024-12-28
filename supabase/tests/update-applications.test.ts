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

test('update-applications function should populate developments table', async () => {
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

  // Verify data in developments table
  const { data: developments, error: dbError } = await supabase
    .from('developments')
    .select('count');
  
  expect(dbError).toBeNull();
  expect(developments).toBeDefined();
  expect(developments.length).toBeGreaterThan(0);
});

// Helper function to clear developments table (commented out for safety)
export async function clearDevelopmentsTable() {
  const { error } = await supabase
    .from('developments')
    .delete()
    .neq('id', 0); // Delete all records
  
  if (error) {
    throw new Error(`Failed to clear developments table: ${error.message}`);
  }
}
