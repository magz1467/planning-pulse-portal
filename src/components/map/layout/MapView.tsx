import { MapContainerComponent } from "@/components/map/MapContainer";
import { Application } from "@/types/planning";
import { memo } from "react";

export interface MapViewProps {
  applications: Application[];
  selectedId: number | null;
  coordinates: [number, number];
  onMarkerClick: (id: number | null) => void;
  onCenterChange?: (center: [number, number]) => void;
  onMapMove?: (map: any) => void;
}

export const MapView = memo(({
  applications,
  selectedId,
  coordinates,
  onMarkerClick,
  onCenterChange,
  onMapMove,
}: MapViewProps) => {
  return (
    <div className="absolute inset-0">
      <MapContainerComponent
        applications={applications}
        coordinates={coordinates}
        selectedId={selectedId}
        onMarkerClick={onMarkerClick}
        onCenterChange={onCenterChange}
        onMapMove={onMapMove}
      />
    </div>
  );
});

MapView.displayName = 'MapView';