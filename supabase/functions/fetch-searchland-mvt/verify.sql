-- Verify the imported data
SELECT 
  application_number,
  status,
  submitted_date,
  description,
  category,
  region,
  ST_AsText(geom) as location
FROM planning_applications
ORDER BY submitted_date DESC
LIMIT 5;