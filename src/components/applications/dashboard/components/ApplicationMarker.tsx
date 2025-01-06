import { memo, useCallback, useMemo } from 'react';
import { Marker } from '@react-google-maps/api';
import { useToast } from '@/hooks/use-toast';

interface ApplicationMarkerProps {
  application: {
    application_id: number;
    centroid: {
      lat: number;
      lng: number;
    };
  };
  isSelected: boolean;
  onClick: (id: number) => void;
}

export const ApplicationMarker = memo(({ 
  application, 
  isSelected, 
  onClick 
}: ApplicationMarkerProps) => {
  const { toast } = useToast();
  
  console.log(`Rendering marker for application ${application.application_id}, isSelected: ${isSelected}`);

  const markerSize = useMemo(() => {
    return isSelected ? 40 : 24;
  }, [isSelected]);

  const handleClick = useCallback(() => {
    console.log(`Marker clicked: ${application.application_id}`);
    if (onClick) {
      onClick(application.application_id);
    }
  }, [application.application_id, onClick]);

  // Validate coordinates before rendering
  if (!application.centroid?.lat || !application.centroid?.lng) {
    console.warn(`Invalid coordinates for application ${application.application_id}`);
    return null;
  }

  return (
    <Marker
      position={{
        lat: application.centroid.lat,
        lng: application.centroid.lng
      }}
      onClick={handleClick}
      icon={{
        url: isSelected ? '/marker-selected.svg' : '/marker.svg',
        scaledSize: new google.maps.Size(markerSize, markerSize),
        anchor: new google.maps.Point(markerSize/2, markerSize/2)
      }}
      zIndex={isSelected ? 1000 : 1}
    />
  );
});

ApplicationMarker.displayName = 'ApplicationMarker';