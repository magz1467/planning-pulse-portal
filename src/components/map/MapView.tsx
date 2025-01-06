import { MapContainerComponent } from "@/components/map/MapContainer";
import { Application } from "@/types/planning";

interface MapViewProps {
  applications: Application[];
  selectedId: number | null;
  coordinates: [number, number];
  onMarkerClick: (id: number) => void;
}

export const MapView = ({
  applications,
  selectedId,
  coordinates,
  onMarkerClick,
}: MapViewProps) => {
  return (
    <div className="absolute inset-0">
      <MapContainerComponent
        applications={applications}
        coordinates={coordinates}
        selectedId={selectedId}
        onMarkerClick={onMarkerClick}
      />
    </div>
  );
};