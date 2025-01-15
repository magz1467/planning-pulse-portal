import { useCallback, memo } from "react";
import { Application } from "@/types/planning";
import { MapAction } from "@/types/map-reducer";
import { MapView } from "./MapView";
import { MapControls } from "./components/MapControls";
import { MobileMapControls } from "./components/MobileMapControls";

interface MapSectionProps {
  isMobile: boolean;
  isMapView: boolean;
  coordinates: [number, number];
  applications: Application[];
  selectedId: number | null;
  dispatch: React.Dispatch<MapAction>;
  onCenterChange?: (center: [number, number]) => void;
}

export const MapSection = memo(({
  isMobile,
  isMapView,
  coordinates,
  applications,
  selectedId,
  dispatch,
  onCenterChange,
}: MapSectionProps) => {
  const handleMarkerClick = useCallback((id: number | null) => {
    console.log('MapSection handleMarkerClick:', id);
    dispatch({ type: 'SELECT_APPLICATION', payload: id });
  }, [dispatch]);

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
      <MapControls
        dispatch={dispatch}
        selectedId={selectedId}
        applications={applications}
        coordinates={coordinates}
        onCenterChange={onCenterChange}
      />
      {isMobile && selectedId && (
        <MobileMapControls
          applications={applications}
          selectedId={selectedId}
          onSelectApplication={handleMarkerClick}
        />
      )}
    </div>
  );
});

MapSection.displayName = 'MapSection';