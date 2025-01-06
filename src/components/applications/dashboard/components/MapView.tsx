import { MapContainer } from "@/components/map/MapContainer";
import { MobileApplicationCards } from "@/components/map/mobile/MobileApplicationCards";
import { Application } from "@/types/planning";

interface MapViewProps {
  applications: Application[];
  selectedId: number | null;
  coordinates: [number, number];
  onMarkerClick: (id: number | null) => void;
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
      <MapContainer
        applications={applications}
        coordinates={coordinates}
        onMarkerClick={onMarkerClick}
        onCenterChange={onCenterChange}
      />
    </div>
  );
};