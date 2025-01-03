-- Create optimized function for getting applications within radius
CREATE OR REPLACE FUNCTION get_applications_within_radius(
  center_lng double precision,
  center_lat double precision,
  radius_meters double precision,
  page_size integer,
  page_number integer
)
RETURNS SETOF applications
LANGUAGE sql
STABLE
AS $$
  SELECT *
  FROM applications
  WHERE geom IS NOT NULL 
  AND ST_DWithin(
    geom::geography,
    ST_SetSRID(ST_MakePoint(center_lng, center_lat), 4326)::geography,
    radius_meters
  )
  ORDER BY application_id
  LIMIT page_size
  OFFSET (page_number * page_size);
$$;

-- Create optimized function for getting total count
CREATE OR REPLACE FUNCTION get_applications_count_within_radius(
  center_lng double precision,
  center_lat double precision,
  radius_meters double precision
)
RETURNS bigint
LANGUAGE sql
STABLE
AS $$
  SELECT count(*)::bigint
  FROM applications
  WHERE geom IS NOT NULL 
  AND ST_DWithin(
    geom::geography,
    ST_SetSRID(ST_MakePoint(center_lng, center_lat), 4326)::geography,
    radius_meters
  );
$$;