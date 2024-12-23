select cron.schedule(
  'check-developments-hourly',
  '0 * * * *', -- Run every hour
  $$
  select
    net.http_post(
        url:='https://jposqxdboetyioymfswd.functions.supabase.co/check-developments',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('supabase.service_role_key') || '"}'::jsonb
    ) as request_id;
  $$
);