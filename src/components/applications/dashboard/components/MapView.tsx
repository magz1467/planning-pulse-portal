import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { LatLngBounds } from 'leaflet';
import { Application } from "@/types/planning";
import { ApplicationMarker } from "./ApplicationMarker";

interface MapViewProps {
  applications: Application[];
  selectedId: number | null;
  onMarkerClick: (id: number) => void;
  onBoundsChange: (bounds: LatLngBounds) => void;
}

// Component to handle map events and bounds
const MapEventHandler = ({ onBoundsChange }: { onBoundsChange: (bounds: LatLngBounds) => void }) => {
  const map = useMapEvents({
    moveend: () => {
      onBoundsChange(map.getBounds());
    },
    zoomend: () => {
      onBoundsChange(map.getBounds());
    },
    load: () => {
      onBoundsChange(map.getBounds());
    }
  });

  // Initial bounds fetch
  useEffect(() => {
    onBoundsChange(map.getBounds());
  }, []);

  return null;
};

export const MapView = ({ applications, selectedId, onMarkerClick, onBoundsChange }: MapViewProps) => {
  const LONDON_COORDINATES: [number, number] = [51.5074, -0.1278];

  return (
    <MapContainer
      center={LONDON_COORDINATES}
      zoom={12}
      minZoom={10}
      style={{ height: "100%", width: "100%" }}
    >
      <MapEventHandler onBoundsChange={onBoundsChange} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={50}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={false}
        zoomToBoundsOnClick={true}
        disableClusteringAtZoom={16}
      >
        {applications.map((app) => (
          <ApplicationMarker
            key={app.id}
            application={app}
            isSelected={app.id === selectedId}
            onClick={() => onMarkerClick(app.id)}
          />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};