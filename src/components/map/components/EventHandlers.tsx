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
    const handleMouseEnter = () => {
      map.getCanvas().style.cursor = 'pointer';
    };
    
    const handleMouseLeave = () => {
      map.getCanvas().style.cursor = '';
    };

    map.on('mouseenter', 'planning-applications', handleMouseEnter);
    map.on('mouseleave', 'planning-applications', handleMouseLeave);

    return () => {
      map.off('click', 'planning-applications', handleClick);
      map.off('mouseenter', 'planning-applications', handleMouseEnter);
      map.off('mouseleave', 'planning-applications', handleMouseLeave);
    };
  }, [map, onMarkerClick]);

  return null;
};