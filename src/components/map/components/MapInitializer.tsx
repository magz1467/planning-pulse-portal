import { useEffect, RefObject } from 'react';
import mapboxgl from 'mapbox-gl';
import { LatLngTuple } from 'leaflet';

interface MapInitializerProps {
  mapContainer: RefObject<HTMLDivElement>;
  mapRef: RefObject<mapboxgl.Map>;
  coordinates: LatLngTuple;
}

export const MapInitializer = ({ mapContainer, mapRef, coordinates }: MapInitializerProps) => {
  useEffect(() => {
    if (!mapContainer.current) return;

    // Set Mapbox token before creating map instance
    const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;
    if (!token) {
      console.error('Mapbox token is not set. Please check your environment variables.');
      return;
    }
    console.log('🗺️ Initializing map with token:', token ? 'Token present' : 'No token');
    mapboxgl.accessToken = token;

    // Set up the authorization header for Searchland MVT requests
    const transformRequest = (url: string, resourceType: string) => {
      console.log('🔒 Transform request for URL:', url);
      if (url.includes('api.searchland.co.uk')) {
        const searchlandKey = import.meta.env.VITE_SEARCHLAND_API_KEY;
        if (!searchlandKey) {
          console.error('Searchland API key is not set');
          return;
        }
        console.log('🔑 Adding Searchland authorization header');
        return {
          url: url,
          headers: {
            'Authorization': `Bearer ${searchlandKey}`,
            'Content-Type': 'application/x-protobuf'
          }
        };
      }
    };

    // Create the map instance
    try {
      console.log('📍 Creating map at coordinates:', coordinates);
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [coordinates[1], coordinates[0]],
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
      });

      // Use Object.defineProperty to set the map reference
      Object.defineProperty(mapRef, 'current', {
        value: map,
        writable: true
      });
    } catch (error) {
      console.error('❌ Error creating map:', error);
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