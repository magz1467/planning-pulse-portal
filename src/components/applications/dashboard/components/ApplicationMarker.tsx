import { memo, useCallback, useMemo } from 'react';
import { Marker } from '@react-google-maps/api';

interface MarkerApplication {
  application_id: number;
  centroid: {
    lat: number;
    lng: number;
  };
}

interface ApplicationMarkerProps {
  application: MarkerApplication;
  isSelected: boolean;
  onClick: (id: number) => void;
}

export const ApplicationMarker = memo(({
  application,
  isSelected,
  onClick
}: ApplicationMarkerProps) => {
  const position = useMemo(() => ({
    lat: application.centroid.lat,
    lng: application.centroid.lng
  }), [application.centroid]);

  const handleClick = useCallback(() => {
    console.log('Marker clicked:', application.application_id);
    onClick(application.application_id);
  }, [application.application_id, onClick]);

  const options = useMemo(() => ({
    optimized: true,
    clickable: true
  }), []);

  return (
    <Marker
      position={position}
      onClick={handleClick}
      zIndex={isSelected ? 2 : 1}
      options={options}
    />
  );
}, (prevProps, nextProps) => {
  // Only re-render if these props change
  return prevProps.isSelected === nextProps.isSelected &&
         prevProps.application.application_id === nextProps.application.application_id &&
         prevProps.application.centroid.lat === nextProps.application.centroid.lat &&
         prevProps.application.centroid.lng === nextProps.application.centroid.lng;
});

ApplicationMarker.displayName = 'ApplicationMarker';