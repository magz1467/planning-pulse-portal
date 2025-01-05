import { Application } from "@/types/planning";
import { MapView } from "./MapView";
import { MobileApplicationCards } from "./mobile/MobileApplicationCards";

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
  console.log("MapContent render", { 
    isMobile, 
    isMapView, 
    selectedId,
    applicationsCount: applications.length 
  });

  if (!coordinates || (!isMobile && !isMapView)) {
    console.log("MapContent: No coordinates or desktop list view");
    return null;
  }

  return (
    <div className="flex-1 relative h-full">
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
          onMarkerClick={onMarkerClick}
          initialCenter={coordinates}
        />
        {isMobile && isMapView && selectedId && (
          console.log("Rendering MobileApplicationCards", { selectedId }),
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