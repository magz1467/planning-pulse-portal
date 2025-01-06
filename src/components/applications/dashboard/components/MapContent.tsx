import { memo, useCallback } from 'react';
import { ApplicationMarker } from './ApplicationMarker';
import { Application } from '@/types/planning';

interface MapContentProps {
  center: google.maps.LatLngLiteral;
  selectedId?: number;
  onMarkerClick: (id: number) => void;
  applications: Application[];
}

export const MapContent = memo(({ 
  center, 
  selectedId, 
  onMarkerClick,
  applications
}: MapContentProps) => {
  const handleMarkerClick = useCallback((id: number) => {
    onMarkerClick(id);
  }, [onMarkerClick]);

  console.log('MapContent rendering with', applications.length, 'applications');

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
  return (
    prevProps.selectedId === nextProps.selectedId &&
    prevProps.applications === nextProps.applications &&
    prevProps.center.lat === nextProps.center.lat &&
    prevProps.center.lng === nextProps.center.lng
  );
});

MapContent.displayName = 'MapContent';