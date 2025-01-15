import { Application } from "@/types/planning";
import { MapView } from "./MapView";
import { MobileApplicationCards } from "@/components/map/mobile/MobileApplicationCards";
import { LoadingOverlay } from "@/components/applications/dashboard/components/LoadingOverlay";
import { memo, useCallback } from 'react';

interface MapContentProps {
  applications: Application[];
  selectedId: number | null;
  coordinates: [number, number];
  isMobile: boolean;
  isMapView: boolean;
  onMarkerClick: (id: number | null) => void;
  onCenterChange?: (center: [number, number]) => void;
  isLoading?: boolean;
}

export const MapContent = memo(({
  applications,
  selectedId,
  coordinates,
  isMobile,
  isMapView,
  onMarkerClick,
  onCenterChange,
  isLoading = false,
}: MapContentProps) => {
  console.log('🗺️ MapContent rendering:', {
    applicationsCount: applications.length,
    selectedId,
    coordinates,
    isMobile,
    isMapView,
    isLoading
  });

  const handleMarkerClick = useCallback((id: number | null) => {
    console.log('MapContent handleMarkerClick:', id);
    onMarkerClick(id);
  }, [onMarkerClick]);

  if (!coordinates || (!isMobile && !isMapView)) {
    console.log('⚠️ MapContent early return - missing coordinates or view conditions not met');
    return null;
  }

  return (
    <div className="flex-1 relative h-full">
      {isLoading && <LoadingOverlay />}
      <div 
        className="absolute inset-0"
        style={{ 
          height: isMobile ? 'calc(100vh - 120px)' : '100%',
          position: 'relative',
          zIndex: 1
        }}
      >
        <MapView
          applications={applications}
          selectedId={selectedId}
          coordinates={coordinates}
          onMarkerClick={handleMarkerClick}
          onCenterChange={onCenterChange}
        />
        {isMobile && selectedId && (
          <MobileApplicationCards
            applications={applications}
            selectedId={selectedId}
            onSelectApplication={handleMarkerClick}
          />
        )}
      </div>
    </div>
  );
});

MapContent.displayName = 'MapContent';