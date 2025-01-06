import { Application } from "@/types/planning";
import { MapContainerComponent } from "@/components/map/MapContainer";
import { MobileApplicationCards } from "@/components/map/mobile/MobileApplicationCards";

interface MapViewProps {
  applications: Application[];
  selectedId: number | null;
  coordinates: [number, number];
  onMarkerClick: (id: number) => void;
  onCenterChange?: (center: [number, number]) => void;
}

export const MapView = ({
  applications,
  selectedId,
  coordinates,
  onMarkerClick,
  onCenterChange,
}: MapViewProps) => {
  return (
    <div className="absolute inset-0">
      <MapContainerComponent
        applications={applications}
        coordinates={coordinates}
        selectedId={selectedId}
        onMarkerClick={onMarkerClick}
        onCenterChange={onCenterChange}
      />
    </div>
  );
};