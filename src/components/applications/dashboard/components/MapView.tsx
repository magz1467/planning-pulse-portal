import { Application } from "@/types/planning";
import { LatLngTuple } from "leaflet";
import { MapboxMap } from "./MapboxMap";
import { useEffect } from 'react';

interface MapViewProps {
  applications: Application[];
  selectedId: number | null;
  onMarkerClick: (id: number) => void;
  initialCenter: LatLngTuple;
}

export const MapView = ({
  applications,
  selectedId,
  onMarkerClick,
  initialCenter,
}: MapViewProps) => {
  // Log the number of visible applications for debugging
  useEffect(() => {
    console.log('MapView - Number of applications:', applications.length);
  }, [applications]);

  return (
    <div className="w-full h-full relative">
      <MapboxMap
        applications={applications}
        selectedId={selectedId}
        onMarkerClick={onMarkerClick}
        initialCenter={initialCenter}
      />
    </div>
  );
};