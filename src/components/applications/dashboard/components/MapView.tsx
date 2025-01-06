import { MapContainer } from "@/components/map/MapContainer";
import { Application } from "@/types/planning";

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
      <MapContainer
        applications={applications}
        coordinates={coordinates}
        onMarkerClick={onMarkerClick}
        onCenterChange={onCenterChange}
      />
    </div>
  );
};