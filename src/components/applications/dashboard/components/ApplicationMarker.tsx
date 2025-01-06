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
    scaledSize: new google.maps.Size(isSelected ? 32 : 24, isSelected ? 32 : 24),
    anchor: new google.maps.Point(isSelected ? 16 : 12, isSelected ? 32 : 24)
  }), [isSelected]);

  return (
    <Marker
      position={position}
      onClick={handleClick}
      icon={icon}
      zIndex={isSelected ? 2 : 1}
    />
  );
}, (prevProps, nextProps) => {
  return prevProps.isSelected === nextProps.isSelected &&
         prevProps.application.application_id === nextProps.application.application_id &&
         prevProps.application.centroid.lat === nextProps.application.centroid.lat &&
         prevProps.application.centroid.lng === nextProps.application.centroid.lng;
});

ApplicationMarker.displayName = 'ApplicationMarker';