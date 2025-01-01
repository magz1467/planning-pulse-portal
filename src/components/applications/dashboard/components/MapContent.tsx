import { Application } from "@/types/planning";
import { MapView } from "./MapView";
import { MobileApplicationCards } from "@/components/map/mobile/MobileApplicationCards";

interface MapContentProps {
  applications: Application[];
  selectedId: number | null;
  coordinates: [number, number];
  isMobile: boolean;
  isMapView: boolean;
  onMarkerClick: (id: number | null) => void;
}

export const MapContent = ({
  applications,
  selectedId,
  coordinates,
  isMobile,
  isMapView,
  onMarkerClick,
}: MapContentProps) => {
  if (!coordinates || (!isMobile && !isMapView)) return null;

  return (
    <div className="flex-1 relative h-full">
      <div 
        className={`absolute inset-0 ${isMobile ? 'h-[calc(100vh-120px)]' : 'h-full'}`}
        style={{ 
          position: 'fixed',
          top: isMobile ? '120px' : 0,
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1
        }}
      >
        <MapView
          applications={applications}
          selectedId={selectedId}
          onMarkerClick={onMarkerClick}
          initialCenter={coordinates}
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