import { Application } from "@/types/planning";
import { MapView } from "./MapView";
import { MobileApplicationCards } from "@/components/map/mobile/MobileApplicationCards";
import { useCallback, memo } from "react";
import { MapAction } from "@/types/map-reducer";

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
        zIndex: 1,
        marginLeft: !isMobile ? '-10%' : '0' // Adjust map position for desktop view
      }}
    >
      <div className="absolute inset-0">
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

MapSection.displayName = 'MapSection';