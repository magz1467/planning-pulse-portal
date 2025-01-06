import { memo, useCallback, useMemo } from 'react';
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

  // Memoize the markers array to prevent unnecessary re-creation
  const markers = useMemo(() => {
    console.log('Creating markers array with', applications.length, 'applications');
    return applications?.map((application) => (
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
    ));
  }, [applications, selectedId, handleMarkerClick]);

  return <>{markers}</>;
}, (prevProps, nextProps) => {
  // Custom comparison function for memo
  const centerEqual = prevProps.center.lat === nextProps.center.lat && 
                     prevProps.center.lng === nextProps.center.lng;
  const selectedIdEqual = prevProps.selectedId === nextProps.selectedId;
  const applicationsEqual = prevProps.applications === nextProps.applications;
  
  return centerEqual && selectedIdEqual && applicationsEqual;
});

MapContent.displayName = 'MapContent';