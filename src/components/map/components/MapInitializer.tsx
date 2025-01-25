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

    // Set up the authorization header for Searchland MVT requests
    const transformRequest = (url: string, resourceType: string) => {
      if (url.includes('api.searchland.co.uk')) {
        return {
          url: url,
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SEARCHLAND_API_KEY}`,
            'Content-Type': 'application/x-protobuf'
          }
        };
      }
    };

    // Set Mapbox token before creating map instance
    const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;
    if (!token) {
      console.error('Mapbox token is not set. Please check your environment variables.');
      return;
    }
    mapboxgl.accessToken = token;

    // Create the map instance
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [coordinates[1], coordinates[0]],
      zoom: 13,
      transformRequest: transformRequest
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Use Object.defineProperty to set the map reference
    Object.defineProperty(mapRef, 'current', {
      value: map,
      writable: true
    });
    
    return () => {
      map.remove();
      // Use Object.defineProperty to clear the map reference
      Object.defineProperty(mapRef, 'current', {
        value: null,
        writable: true
      });
    };
  }, []);

  return null;
};