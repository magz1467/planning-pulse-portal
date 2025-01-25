import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { RefObject } from 'react';

interface MapInitializerProps {
  mapContainer: RefObject<HTMLDivElement>;
  mapRef: RefObject<mapboxgl.Map>;
  coordinates: [number, number];
}

export const MapInitializer = ({ mapContainer, mapRef, coordinates }: MapInitializerProps) => {
  useEffect(() => {
    if (!mapContainer.current) return;

    const apiKey = import.meta.env.VITE_SEARCHLAND_API_KEY;
    
    // Set up the authorization header for Searchland MVT requests
    const transformRequest = (url: string, resourceType: string) => {
      if (url.includes('api.searchland.co.uk')) {
        return {
          url: url,
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/x-protobuf'
          }
        };
      }
    };

    // Set Mapbox token before creating map instance
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN || '';

    // Create the map instance without directly assigning to ref
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [coordinates[1], coordinates[0]],
      zoom: 13,
      transformRequest: transformRequest
    });

    // Use Object.defineProperty to set the ref
    Object.defineProperty(mapRef, 'current', {
      value: map,
      writable: true
    });
    
    map.addControl(new mapboxgl.NavigationControl(), 'top-right');
    
    return () => {
      map.remove();
      // Use Object.defineProperty to clear the ref
      Object.defineProperty(mapRef, 'current', {
        value: null,
        writable: true
      });
    };
  }, []);

  return null;
};