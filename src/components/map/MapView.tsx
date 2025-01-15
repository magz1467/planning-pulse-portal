import { MapContainerComponent } from "@/components/map/MapContainer";
import { Application } from "@/types/planning";
import { memo } from "react";
import { Map as LeafletMap } from "leaflet";

export interface MapViewProps {
  applications: Application[];
  selectedId: number | null;
  coordinates: [number, number];
  onMarkerClick: (id: number) => void;
  onCenterChange?: (center: [number, number]) => void;
  onMapMove?: (map: LeafletMap) => void;
}

export const MapView = memo(({
  applications,
  selectedId,
  coordinates,
  onMarkerClick,
  onCenterChange,
  onMapMove,
}: MapViewProps) => {
  console.log('MapView rendering:', {
    applicationsCount: applications?.length,
    selectedId,
    coordinates
  });

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