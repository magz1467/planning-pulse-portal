import { Application } from '@/types/planning';
import { LatLngTuple } from 'leaflet';
import { MapboxContainer } from './mapbox/MapboxContainer';

interface MapboxMapProps {
  applications: Application[];
  selectedId: number | null;
  onMarkerClick: (id: number) => void;
  initialCenter: LatLngTuple;
}

export const MapboxMap = ({
  applications,
  selectedId,
  onMarkerClick,
  initialCenter,
}: MapboxMapProps) => {
  return (
    <MapboxContainer
      applications={applications}
      selectedId={selectedId}
      onMarkerClick={onMarkerClick}
      initialCenter={initialCenter}
    />
  );
};