import { memo, useCallback } from 'react';
import { ApplicationMarker } from './ApplicationMarker';
import { useApplicationsData } from '../hooks/useApplicationsData';
import { Application } from '@/types/planning';

interface MapContentProps {
  center: google.maps.LatLngLiteral;
  selectedId?: number;
  onMarkerClick: (id: number) => void;
}

export const MapContent = memo(({ 
  center, 
  selectedId, 
  onMarkerClick 
}: MapContentProps) => {
  const { applications, isLoading } = useApplicationsData();

  const handleMarkerClick = useCallback((id: number) => {
    console.log(`Marker clicked in MapContent: ${id}`);
    onMarkerClick(id);
  }, [onMarkerClick]);

  if (isLoading) {
    return null;
  }

  return (
    <>
      {applications?.map((application) => (
        <ApplicationMarker
          key={application.id}
          application={{
            application_id: application.id,
            centroid: {
              lat: application.coordinates[0],
              lng: application.coordinates[1]
            }
          }}
          isSelected={application.id === selectedId}
          onClick={handleMarkerClick}
        />
      ))}
    </>
  );
}, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return prevProps.selectedId === nextProps.selectedId &&
         prevProps.center.lat === nextProps.center.lat &&
         prevProps.center.lng === nextProps.center.lng;
});

MapContent.displayName = 'MapContent';