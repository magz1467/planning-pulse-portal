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

  const markerOptions = useMemo(() => ({
    clickable: true,
    cursor: 'pointer',
    optimized: false,
    zIndex: isSelected ? 1000 : 1,
    animation: isSelected ? google.maps.Animation.BOUNCE : undefined
  }), [isSelected]);

  return (
    <Marker
      position={position}
      onClick={handleClick}
      options={markerOptions}
    />
  );
});

ApplicationMarker.displayName = 'ApplicationMarker';