import { useEffect, RefObject } from 'react';
import mapboxgl from 'mapbox-gl';
import { supabase } from '@/integrations/supabase/client';

interface MapInitializerProps {
  mapContainer: RefObject<HTMLDivElement>;
  mapRef: RefObject<mapboxgl.Map>;
  coordinates: [number, number];
}

export const MapInitializer = ({ mapContainer, mapRef, coordinates }: MapInitializerProps) => {
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      try {
        // Get Mapbox token from Supabase Edge Function
        const { data, error } = await supabase.functions.invoke('get-mapbox-token')
        
        if (error) {
          console.error('Error fetching Mapbox token:', error)
          return
        }

        const { token } = data as { token: string }
        
        if (!token) {
          console.error('No Mapbox token returned')
          return
        }

        // Set the token
        mapboxgl.accessToken = token

        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [coordinates[1], coordinates[0]], // Mapbox uses [lng, lat]
          zoom: 14
        });

        // Using Object.assign to avoid the readonly error
        Object.assign(mapRef, { current: map });

        return () => {
          map.remove();
          Object.assign(mapRef, { current: null });
        };
      } catch (err) {
        console.error('Error initializing map:', err)
      }
    }

    initializeMap()
  }, [coordinates, mapContainer, mapRef]);

  return null;
};