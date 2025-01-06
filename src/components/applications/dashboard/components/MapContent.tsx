import { memo, useCallback, useEffect, useState } from 'react';
import { ApplicationMarker } from './ApplicationMarker';
import { useApplicationsData } from '../hooks/useApplicationsData';

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
  const [renderedMarkersCount, setRenderedMarkersCount] = useState(0);
  const { applications, isLoading } = useApplicationsData(center);

  useEffect(() => {
    console.log(`MapContent rendered with ${applications?.length || 0} applications, selectedId: ${selectedId}`);
    setRenderedMarkersCount(applications?.length || 0);
  }, [applications?.length, selectedId]);

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
          key={application.application_id}
          application={application}
          isSelected={application.application_id === selectedId}
          onClick={handleMarkerClick}
        />
      ))}
    </>
  );
});

MapContent.displayName = 'MapContent';