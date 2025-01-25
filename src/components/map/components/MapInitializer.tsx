import { useEffect, RefObject } from 'react';
import mapboxgl from 'mapbox-gl';

interface MapInitializerProps {
  mapContainer: RefObject<HTMLDivElement>;
  mapRef: RefObject<mapboxgl.Map>;
  coordinates: [number, number];
}

export const MapInitializer = ({ mapContainer, mapRef, coordinates }: MapInitializerProps) => {
  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1IjoibWFyY29hZyIsImEiOiJjajhvb2NyOWYwNXRhMnJvMDNtYjh4NmdxIn0.wUpTbsVWQuPwRHDwpnCznA';
    
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [coordinates[1], coordinates[0]], // Mapbox uses [lng, lat]
      zoom: 14
    });

    return () => {
      mapRef.current?.remove();
    };
  }, [coordinates, mapContainer, mapRef]);

  return null;
};