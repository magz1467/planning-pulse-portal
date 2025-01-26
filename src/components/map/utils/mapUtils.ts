import mapboxgl from 'mapbox-gl';
import { supabase } from '@/integrations/supabase/client';

export const initializeMap = async (
  container: HTMLDivElement,
  coordinates: [number, number]
): Promise<mapboxgl.Map> => {
  // Get Mapbox token from Supabase
  const { data: { token }, error } = await supabase.functions.invoke('get-mapbox-token');
  if (error) throw error;

  mapboxgl.accessToken = token;

  return new mapboxgl.Map({
    container,
    style: 'mapbox://styles/mapbox/light-v11',
    center: [coordinates[1], coordinates[0]],
    zoom: 13,
    pitch: 0,
    bearing: 0,
  });
};

export const setupVectorTileSource = (map: mapboxgl.Map) => {
  if (!map.getSource('planning-applications')) {
    try {
      map.addSource('planning-applications', {
        type: 'vector',
        tiles: [`${window.location.origin}/functions/v1/fetch-searchland-mvt/{z}/{x}/{y}`],
        minzoom: 0,
        maxzoom: 22,
        scheme: "xyz",
        tolerance: 0
      });

      map.addLayer({
        'id': 'planning-applications',
        'type': 'circle',
        'source': 'planning-applications',
        'source-layer': 'planning',
        'paint': {
          'circle-radius': 8,
          'circle-color': [
            'match',
            ['get', 'status'],
            'approved', '#16a34a',
            'refused', '#ea384c',
            '#F97316'
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });
    } catch (error) {
      console.error('Error setting up vector tiles:', error);
    }
  }
};

export const cleanupMap = (map: mapboxgl.Map | null) => {
  if (!map || map._removed) return;

  try {
    if (map.getLayer('planning-applications')) {
      map.removeLayer('planning-applications');
    }
    if (map.getSource('planning-applications')) {
      map.removeSource('planning-applications');
    }
    map.remove();
  } catch (error) {
    console.error('Error cleaning up map:', error);
  }
};