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
    console.log('MapContent: Marker clicked:', id);
    onMarkerClick(id);
  }, [onMarkerClick]);

  if (isLoading) {
    console.log('MapContent: Loading applications...');
    return null;
  }

  console.log('MapContent: Rendering with', {
    applicationsCount: applications?.length,
    selectedId,
    center
  });

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
  const centerChanged = 
    prevProps.center.lat !== nextProps.center.lat || 
    prevProps.center.lng !== nextProps.center.lng;
  
  const selectedIdChanged = prevProps.selectedId !== nextProps.selectedId;
  
  const shouldUpdate = centerChanged || selectedIdChanged;
  
  if (shouldUpdate) {
    console.log('MapContent will update:', {
      reason: {
        centerChanged,
        selectedIdChanged
      }
    });
  }
  
  return !shouldUpdate;
});

MapContent.displayName = 'MapContent';