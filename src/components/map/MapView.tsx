import { MapContainerComponent } from "@/components/map/MapContainer";
import { Application } from "@/types/planning";
import { memo } from "react";

interface MapViewProps {
  applications: Application[];
  selectedId: number | null;
  coordinates: [number, number];
  onMarkerClick: (id: number) => void;
}

export const MapView = memo(({
  applications,
  selectedId,
  coordinates,
  onMarkerClick,
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
      />
    </div>
  );
});

MapView.displayName = 'MapView';