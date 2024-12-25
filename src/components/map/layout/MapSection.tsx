import { Application } from "@/types/planning";
import { MapContainerComponent } from "../MapContainer";
import { MobileApplicationCards } from "../MobileApplicationCards";

interface MapSectionProps {
  isMobile: boolean;
  isMapView: boolean;
  coordinates: [number, number];
  postcode: string;
  applications: Application[];
  selectedApplication: number | null;
  onMarkerClick: (id: number) => void;
}

export const MapSection = ({
  isMobile,
  isMapView,
  coordinates,
  postcode,
  applications,
  selectedApplication,
  onMarkerClick,
}: MapSectionProps) => {
  return (
    <div 
      className={`flex-1 relative ${isMobile && !isMapView ? 'hidden' : 'block'}`}
      style={{ height: isMobile ? 'calc(100dvh - 120px)' : '100%' }}
    >
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
  );
};