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
    onClick(application.application_id);
  }, [application.application_id, onClick]);

  const icon = useMemo(() => ({
    url: isSelected ? '/marker-selected.svg' : '/marker.svg',
    scaledSize: new google.maps.Size(isSelected ? 40 : 24, isSelected ? 40 : 24),
    anchor: new google.maps.Point(isSelected ? 20 : 12, isSelected ? 40 : 24)
  }), [isSelected]);

  return (
    <Marker
      position={position}
      onClick={handleClick}
      icon={icon}
      zIndex={isSelected ? 1000 : 1} // Ensure selected marker appears above others
    />
  );
}, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return prevProps.isSelected === nextProps.isSelected &&
         prevProps.application.application_id === nextProps.application.application_id &&
         prevProps.application.centroid.lat === nextProps.application.centroid.lat &&
         prevProps.application.centroid.lng === nextProps.application.centroid.lng;
});

ApplicationMarker.displayName = 'ApplicationMarker';