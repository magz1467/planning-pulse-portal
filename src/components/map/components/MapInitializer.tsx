import { useEffect, RefObject } from 'react';
import mapboxgl from 'mapbox-gl';
import { LatLngTuple } from 'leaflet';
import { toast } from '@/components/ui/use-toast';

interface MapInitializerProps {
  mapContainer: RefObject<HTMLDivElement>;
  mapRef: RefObject<mapboxgl.Map>;
  coordinates: LatLngTuple;
}

export const MapInitializer = ({ mapContainer, mapRef, coordinates }: MapInitializerProps) => {
  useEffect(() => {
    if (!mapContainer.current) return;

    // Set Mapbox token before creating map instance
    const token = import.meta.env.MAPBOX_PUBLIC_TOKEN;
    if (!token) {
      console.error('Mapbox token is not set');
      toast({
        title: "Map Error",
        description: "Unable to initialize map. Please check configuration.",
        variant: "destructive"
      });
      return;
    }

    console.log('🗺️ Initializing map with coordinates:', coordinates);
    mapboxgl.accessToken = token;

    // Set up the authorization header for Searchland MVT requests
    const transformRequest = (url: string, resourceType: string) => {
      if (url.includes('api.searchland.co.uk')) {
        const searchlandKey = import.meta.env.SEARCHLAND_API_KEY;
        if (!searchlandKey) {
          console.error('Searchland API key is not set');
          return;
        }
        return {
          url: url,
          headers: {
            'Authorization': `Bearer ${searchlandKey}`,
            'Content-Type': 'application/x-protobuf'
          }
        };
      }
    };

    try {
      // Create the map instance
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [coordinates[1], coordinates[0]], // Convert to [lng, lat]
        zoom: 13,
        transformRequest: transformRequest
      });

      // Add navigation controls
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Log when map loads
      map.on('load', () => {
        console.log('🌍 Map loaded successfully');
      });

      // Log any map errors
      map.on('error', (e) => {
        console.error('🚨 Map error:', e);
        toast({
          title: "Map Error",
          description: "There was an error loading the map. Please try refreshing.",
          variant: "destructive"
        });
      });

      // Use Object.defineProperty to set the map reference
      Object.defineProperty(mapRef, 'current', {
        value: map,
        writable: true
      });
    } catch (error) {
      console.error('❌ Error creating map:', error);
      toast({
        title: "Map Error",
        description: "Failed to initialize map. Please try again later.",
        variant: "destructive"
      });
    }
    
    return () => {
      if (mapRef.current) {
        console.log('🧹 Cleaning up map');
        mapRef.current.remove();
        // Use Object.defineProperty to clear the map reference
        Object.defineProperty(mapRef, 'current', {
          value: null,
          writable: true
        });
      }
    };
  }, []);

  return null;
};