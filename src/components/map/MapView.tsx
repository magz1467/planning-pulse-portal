import { MapContainerComponent } from "@/components/map/MapContainer";
import { Application } from "@/types/planning";
import { Map as LeafletMap } from "leaflet";
import { memo, ReactNode } from "react";

export interface MapViewProps {
  applications: Application[];
  selectedId: number | null;
  coordinates: [number, number];
  onMarkerClick: (id: number) => void;
  onCenterChange?: (center: [number, number]) => void;
  onMapMove?: (map: LeafletMap) => void;
  children?: ReactNode;
}

export const MapView = memo(({
  applications,
  selectedId,
  coordinates,
  onMarkerClick,
  onCenterChange,
  onMapMove,
  children
}: MapViewProps) => {
  console.log('MapView rendering:', {
    applicationsCount: applications.length,
    coordinates,
    selectedId
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
      >
        {children}
      </MapContainerComponent>
    </div>
  );
});

MapView.displayName = 'MapView';