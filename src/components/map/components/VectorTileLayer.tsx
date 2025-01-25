import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { supabase } from "@/integrations/supabase/client";

interface VectorTileLayerProps {
  map: mapboxgl.Map;
  baseUrl: string;
}

export const VectorTileLayer = ({ map, baseUrl }: VectorTileLayerProps) => {
  useEffect(() => {
    const setupVectorTiles = async () => {
      try {
        console.log('Adding vector tile source...');
        
        map.addSource('planning-applications', {
          type: 'vector',
          tiles: [`${baseUrl}/functions/v1/fetch-searchland-mvt/{z}/{x}/{y}?apikey=${supabase.auth.anon.key}`],
          minzoom: 0,
          maxzoom: 22,
          scheme: "xyz",
          tileSize: 512,
          attribution: "",
          promoteId: "id"
        });

        console.log('Adding planning applications layer...');
        map.addLayer({
          'id': 'planning-applications',
          'type': 'circle',
          'source': 'planning-applications',
          'source-layer': 'planning',
          'paint': {
            'circle-color': [
              'match',
              ['get', 'status'],
              'approved', '#16a34a',
              'refused', '#ea384c',
              '#F97316' // default orange
            ],
            'circle-radius': 8,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });

        console.log('Successfully added source and layers');
      } catch (error) {
        console.error('Error adding vector tile source:', error);
      }
    };

    map.on('load', setupVectorTiles);
  }, [map, baseUrl]);

  return null;
};