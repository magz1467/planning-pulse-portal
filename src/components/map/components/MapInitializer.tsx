import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { supabase } from '@/integrations/supabase/client';
import { LatLngTuple } from 'leaflet';

interface MapInitializerProps {
  mapContainer: React.RefObject<HTMLDivElement>;
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  coordinates: LatLngTuple;
}

export const MapInitializer = ({ mapContainer, mapRef, coordinates }: MapInitializerProps) => {
  useEffect(() => {
    const initializeMap = async () => {
      // Don't initialize if container is missing or map already exists
      if (!mapContainer.current || mapRef.current) return;

      try {
        // Get Mapbox token from Supabase
        const { data: { token }, error } = await supabase.functions.invoke('get-mapbox-token');
        
        if (error) throw error;
        
        mapboxgl.accessToken = token;

        // Create new map instance
        const map = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/light-v11',
          center: [coordinates[1], coordinates[0]], // Convert to [lng, lat]
          zoom: 13,
          pitch: 0,
          bearing: 0,
        });

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Store map reference
        mapRef.current = map;

        // Wait for map to load before allowing interactions
        await new Promise<void>((resolve) => {
          map.once('load', () => resolve());
        });

      } catch (error) {
        console.error('Error initializing map:', error);
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      if (mapRef.current && !mapRef.current._removed) {
        try {
          // Remove all markers first
          const markers = mapRef.current.getCanvasContainer().getElementsByClassName('marker');
          Array.from(markers).forEach(marker => marker.remove());
          
          // Remove map instance
          mapRef.current.remove();
          mapRef.current = null;
        } catch (error) {
          console.error('Error cleaning up map:', error);
        }
      }
    };
  }, [mapContainer, mapRef, coordinates]);

  return null;
};