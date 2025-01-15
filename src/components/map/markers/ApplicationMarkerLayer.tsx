import { memo } from 'react';
import { Application } from "@/types/planning";
import { ApplicationMarkers } from "@/components/map/ApplicationMarkers";

interface ApplicationMarkerLayerProps {
  applications: Application[];
  selectedId: number | null;
  coordinates: [number, number];
  onMarkerClick: (id: number | null) => void;
}

export const ApplicationMarkerLayer = memo(({
  applications,
  selectedId,
  coordinates,
  onMarkerClick
}: ApplicationMarkerLayerProps) => {
  return (
    <ApplicationMarkers
      applications={applications}
      selectedId={selectedId}
      baseCoordinates={coordinates}
      onMarkerClick={onMarkerClick}
    />
  );
});

ApplicationMarkerLayer.displayName = 'ApplicationMarkerLayer';