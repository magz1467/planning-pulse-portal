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
  }, [coordinates, mapContainer, mapRef]);

  return null;
};