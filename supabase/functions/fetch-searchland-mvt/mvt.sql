CREATE OR REPLACE FUNCTION fetch_searchland_mvt(z integer, x integer, y integer)
RETURNS bytea
LANGUAGE plpgsql
IMMUTABLE
PARALLEL SAFE
STRICT
AS $$
DECLARE
  bounds GEOMETRY;
  mvt BYTEA;
BEGIN
  -- Convert tile coordinates to web mercator bounds
  WITH bounds AS (
    SELECT ST_TileEnvelope(z, x, y) AS geom
  )
  SELECT ST_AsMVT(tile, 'planning', 4096, 'geom') INTO mvt
  FROM (
    SELECT 
      application_number,
      status,
      submitted_date,
      description,
      category,
      ST_AsMVTGeom(
        ST_Transform(geom, 3857),
        bounds.geom,
        4096,
        256,
        true
      ) AS geom
    FROM planning_applications, bounds
    WHERE geom && ST_Transform(bounds.geom, 4326)
  ) AS tile;

  RETURN mvt;
END;
$$;