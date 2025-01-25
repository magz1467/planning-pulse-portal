import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { supabase } from '@/integrations/supabase/client';

interface VectorTileLayerProps {
  map: mapboxgl.Map;
}

export const VectorTileLayer = ({ map }: VectorTileLayerProps) => {
  useEffect(() => {
    const initializeVectorLayer = async () => {
      try {
        const response = await supabase.functions.invoke('fetch-searchland-pins', {
          method: 'GET'
        });

        if (response.error) {
          console.error('Failed to get function URL:', response.error);
          return;
        }

        const url = response.data?.url;
        if (!url) {
          console.error('Failed to get function URL - no URL in response');
          return;
        }

        // Add vector tile source
        map.addSource('planning-applications', {
          type: 'vector',
          tiles: [
            `${url}/{z}/{x}/{y}`
          ],
          minzoom: 10,
          maxzoom: 16
        });

        // Add layer for planning applications
        map.addLayer({
          id: 'planning-applications',
          type: 'circle',
          source: 'planning-applications',
          'source-layer': 'planning_applications',
          paint: {
            'circle-radius': 6,
            'circle-color': [
              'match',
              ['get', 'status'],
              'approved', '#16a34a',
              'refused', '#ea384c',
              '#F97316' // default orange
            ],
            'circle-opacity': 0.8
          }
        });
      } catch (error) {
        console.error('Error initializing vector layer:', error);
      }
    };

    map.on('load', initializeVectorLayer);

    return () => {
      if (map.getLayer('planning-applications')) {
        map.removeLayer('planning-applications');
      }
      if (map.getSource('planning-applications')) {
        map.removeSource('planning-applications');
      }
    };
  }, [map]);

  return null;
};