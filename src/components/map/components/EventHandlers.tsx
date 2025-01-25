import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

interface EventHandlersProps {
  map: mapboxgl.Map;
  onMarkerClick: (id: number) => void;
}

export const EventHandlers = ({ map, onMarkerClick }: EventHandlersProps) => {
  useEffect(() => {
    // Handle clicks
    const handleClick = (e: mapboxgl.MapMouseEvent & { features?: mapboxgl.MapboxGeoJSONFeature[] }) => {
      if (!e.features?.length) return;
      const feature = e.features[0];
      onMarkerClick(feature.properties.id);
    };

    map.on('click', 'planning-applications', handleClick);

    // Change cursor on hover
    map.on('mouseenter', 'planning-applications', () => {
      map.getCanvas().style.cursor = 'pointer';
    });
    
    map.on('mouseleave', 'planning-applications', () => {
      map.getCanvas().style.cursor = '';
    });

    return () => {
      map.off('click', 'planning-applications', handleClick);
      map.off('mouseenter', 'planning-applications');
      map.off('mouseleave', 'planning-applications');
    };
  }, [map, onMarkerClick]);

  return null;
};