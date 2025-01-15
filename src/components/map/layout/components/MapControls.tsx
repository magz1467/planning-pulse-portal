import { useCallback } from 'react';
import { Application } from "@/types/planning";
import { MapAction } from "@/types/map-reducer";
import { MapView } from "../MapView";

interface MapControlsProps {
  dispatch: React.Dispatch<MapAction>;
  selectedId: number | null;
  applications: Application[];
  coordinates: [number, number];
  onCenterChange?: (center: [number, number]) => void;
}

export const MapControls = ({
  dispatch,
  selectedId,
  applications,
  coordinates,
  onCenterChange,
}: MapControlsProps) => {
  const handleMarkerClick = useCallback((id: number | null) => {
    console.log('MapControls handleMarkerClick:', id);
    dispatch({ type: 'SELECT_APPLICATION', payload: id });
  }, [dispatch]);

  return (
    <div className="absolute inset-0">
      <MapView
        applications={applications}
        selectedId={selectedId}
        coordinates={coordinates}
        onMarkerClick={handleMarkerClick}
        onCenterChange={onCenterChange}
      />
    </div>
  );
};