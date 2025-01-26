import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface EventHandlersProps {
  map: mapboxgl.Map;
  onMarkerClick: (id: number) => void;
}

export const EventHandlers = ({ map, onMarkerClick }: EventHandlersProps) => {
  useEffect(() => {
    // No specific event handlers needed for markers as they're handled in MapContainer
    return () => {
      // Cleanup if needed
    };
  }, [map, onMarkerClick]);

  return null;
};