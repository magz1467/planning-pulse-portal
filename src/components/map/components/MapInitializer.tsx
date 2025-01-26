import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { initializeMap } from '../utils/mapUtils';

interface MapInitializerProps {
  mapContainer: React.RefObject<HTMLDivElement>;
  mapRef: React.MutableRefObject<mapboxgl.Map | null>;
  coordinates: [number, number];
}

export const MapInitializer = ({ mapContainer, mapRef, coordinates }: MapInitializerProps) => {
  useEffect(() => {
    const initializeMapInstance = async () => {
      // Don't initialize if container is missing or map already exists
      if (!mapContainer.current || mapRef.current) return;

      try {
        // Create new map instance
        const map = await initializeMap(mapContainer.current, coordinates);
        
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

    initializeMapInstance();

    // Cleanup function
    return () => {
      if (mapRef.current && !mapRef.current._removed) {
        try {
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