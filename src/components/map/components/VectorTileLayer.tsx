import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface VectorTileLayerProps {
  map: mapboxgl.Map;
}

export const VectorTileLayer = ({ map }: VectorTileLayerProps) => {
  useEffect(() => {
    const initializeVectorLayer = async () => {
      try {
        // Add vector tile source
        map.addSource('planning-applications', {
          type: 'vector',
          tiles: [
            `${window.location.origin}/api/tiles/{z}/{x}/{y}`
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