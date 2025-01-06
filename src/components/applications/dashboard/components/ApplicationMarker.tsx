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

  // Enhanced marker options for better visual feedback
  const markerOptions = useMemo(() => ({
    position,
    clickable: true,
    cursor: 'pointer',
    zIndex: isSelected ? 1000 : 1, // Ensure selected marker is always on top
    icon: {
      url: isSelected ? '/marker-selected.svg' : '/marker.svg',
      scaledSize: new google.maps.Size(isSelected ? 40 : 24, isSelected ? 40 : 24),
      anchor: new google.maps.Point(isSelected ? 20 : 12, isSelected ? 40 : 24),
      animation: isSelected ? google.maps.Animation.BOUNCE : null
    }
  }), [isSelected, position]);

  return (
    <Marker
      {...markerOptions}
      onClick={handleClick}
    />
  );
});

ApplicationMarker.displayName = 'ApplicationMarker';