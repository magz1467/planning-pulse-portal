import { MapContainerComponent } from "@/components/map/MapContainer";
import { Application } from "@/types/planning";
import { memo, useCallback } from "react";

interface MapViewProps {
  applications: Application[];
  selectedId: number | null;
  coordinates: [number, number];
  onMarkerClick: (id: number) => void;
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
  console.log('MapView rendering:', {
    applicationsCount: applications?.length,
    selectedId,
    coordinates
  });

  const handleMarkerClick = useCallback((id: number) => {
    console.log('MapView handleMarkerClick:', id);
    onMarkerClick(id);
  }, [onMarkerClick]);

  return (
    <div className="absolute inset-0">
      <MapContainerComponent
        applications={applications}
        coordinates={coordinates}
        selectedId={selectedId}
        onMarkerClick={handleMarkerClick}
        onCenterChange={onCenterChange}
        onMapMove={onMapMove}
      />
    </div>
  );
});

MapView.displayName = 'MapView';