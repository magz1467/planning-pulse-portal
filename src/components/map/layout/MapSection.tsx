import { Application } from "@/types/planning";
import { MapContainerComponent } from "../MapContainer";
import { MobileApplicationCards } from "../mobile/MobileApplicationCards";

interface MapSectionProps {
  isMobile: boolean;
  isMapView: boolean;
  coordinates: [number, number];
  applications: Application[];
  selectedId: number | null;
  onMarkerClick: (id: number | null) => void;
  onCenterChange?: (center: [number, number]) => void;
}

export const MapSection = ({
  isMobile,
  isMapView,
  coordinates,
  applications,
  selectedId,
  onMarkerClick,
  onCenterChange,
}: MapSectionProps) => {
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
        <MapContainerComponent
          applications={applications}
          coordinates={coordinates}
          onMarkerClick={onMarkerClick}
          onCenterChange={onCenterChange}
        />
        {isMobile && selectedId && (
          <MobileApplicationCards
            applications={applications}
            selectedId={selectedId}
            onSelectApplication={onMarkerClick}
          />
        )}
      </div>
    </div>
  );
};