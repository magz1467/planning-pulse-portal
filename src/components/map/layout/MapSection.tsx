import { Application } from "@/types/planning";
import { MapView } from "./MapView";
import { MobileApplicationCards } from "@/components/map/mobile/MobileApplicationCards";
import { useCallback, memo, useMemo } from "react";

interface MapSectionProps {
  isMobile: boolean;
  isMapView: boolean;
  coordinates: [number, number];
  applications: Application[];
  selectedId: number | null;
  onMarkerClick: (id: number | null) => void;
  onCenterChange?: (center: [number, number]) => void;
}

export const MapSection = memo(({
  isMobile,
  isMapView,
  coordinates,
  applications,
  selectedId,
  onMarkerClick,
  onCenterChange,
}: MapSectionProps) => {
  const handleMarkerClick = useCallback((id: number | null) => {
    console.log('MapSection handleMarkerClick:', id);
    // Force the click to be handled synchronously
    setTimeout(() => {
      onMarkerClick(id);
    }, 0);
  }, [onMarkerClick]);

  // Memoize applications to prevent unnecessary re-renders
  const memoizedApplications = useMemo(() => applications, [applications]);

  if (!coordinates || (!isMobile && !isMapView)) return null;

  return (
    <div 
      className="flex-1 relative"
      style={{ 
        height: isMobile ? 'calc(100vh - 120px)' : '100%',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div className="absolute inset-0">
        <MapView
          applications={memoizedApplications}
          selectedId={selectedId}
          coordinates={coordinates}
          onMarkerClick={handleMarkerClick}
          onCenterChange={onCenterChange}
        />
        {isMobile && selectedId && (
          <MobileApplicationCards
            applications={memoizedApplications}
            selectedId={selectedId}
            onSelectApplication={onMarkerClick}
          />
        )}
      </div>
    </div>
  );
});

MapSection.displayName = 'MapSection';