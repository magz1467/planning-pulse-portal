-- Enable required extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule the function to run daily at midnight
SELECT cron.schedule(
  'update-planning-data-daily',
  '0 0 * * *',
  $$
  SELECT
    net.http_post(
      url:='https://jposqxdboetyioymfswd.supabase.co/functions/v1/update-applications',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb
    ) as request_id;
  $$
);
