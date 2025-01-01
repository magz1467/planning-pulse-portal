import { Application } from "@/types/planning";
import { MapContainerComponent } from "../../MapContainer";
import { MobileApplicationCards } from "../../mobile/MobileApplicationCards";

interface MapContainerProps {
  isMobile: boolean;
  isMapView: boolean;
  coordinates: [number, number];
  postcode: string;
  applications: Application[];
  selectedApplication: number | null;
  onMarkerClick: (id: number | null) => void;
}

export const MapContainer = ({
  isMobile,
  isMapView,
  coordinates,
  postcode,
  applications,
  selectedApplication,
  onMarkerClick,
}: MapContainerProps) => {
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
          coordinates={coordinates}
          postcode={postcode}
          applications={applications}
          selectedApplication={selectedApplication}
          onMarkerClick={onMarkerClick}
        />
        {isMobile && isMapView && selectedApplication !== null && (
          <MobileApplicationCards
            applications={applications}
            selectedId={selectedApplication}
            onSelectApplication={onMarkerClick}
          />
        )}
      </div>
    </div>
  );
};