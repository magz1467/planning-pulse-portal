import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface VectorTileLayerProps {
  map: mapboxgl.Map;
}

export const VectorTileLayer = ({ map }: VectorTileLayerProps) => {
  useEffect(() => {
    const initializeVectorLayer = async () => {
      try {
        // Add vector tile source for planning applications
        if (!map.getSource('planning-applications')) {
          map.addSource('planning-applications', {
            type: 'vector',
            tiles: ['https://api.searchland.co.uk/v1/maps/mvt/planning_applications/{z}/{x}/{y}'],
            minzoom: 10,
            maxzoom: 16
          });

          // Add circle layer for planning applications
          map.addLayer({
            'id': 'planning-applications',
            'type': 'circle',
            'source': 'planning-applications',
            'source-layer': 'planning_applications',
            'paint': {
              'circle-radius': 6,
              'circle-color': [
                'match',
                ['get', 'status'],
                'approved', '#16a34a',
                'refused', '#ea384c',
                '#F97316' // default orange for other statuses
              ],
              'circle-opacity': 0.8,
              'circle-stroke-width': 1,
              'circle-stroke-color': '#ffffff'
            }
          });

          // Add click handler for the pins
          map.on('click', 'planning-applications', (e) => {
            if (e.features && e.features[0]) {
              console.log('Clicked feature:', e.features[0]);
              const id = e.features[0].properties?.id;
              if (id) {
                // Handle click event
                console.log('Clicked application ID:', id);
              }
            }
          });

          // Change cursor on hover
          map.on('mouseenter', 'planning-applications', () => {
            map.getCanvas().style.cursor = 'pointer';
          });

          map.on('mouseleave', 'planning-applications', () => {
            map.getCanvas().style.cursor = '';
          });
        }
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