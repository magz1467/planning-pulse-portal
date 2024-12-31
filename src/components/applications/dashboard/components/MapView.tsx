import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import MarkerClusterGroup from 'react-leaflet-markercluster';
import { LatLngBounds } from 'leaflet';
import { Application } from "@/types/planning";
import { ApplicationMarker } from "./ApplicationMarker";
import { useEffect } from "react";

interface MapViewProps {
  applications: Application[];
  selectedId: number | null;
  onMarkerClick: (id: number) => void;
  onBoundsChange: (bounds: LatLngBounds) => void;
}

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

  useEffect(() => {
    // Ensure map is initialized before trying to get bounds
    if (map) {
      onBoundsChange(map.getBounds());
    }
  }, [map, onBoundsChange]);

  return null;
};

export const MapView = ({ applications, selectedId, onMarkerClick, onBoundsChange }: MapViewProps) => {
  const LONDON_COORDINATES: [number, number] = [51.5074, -0.1278];

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={LONDON_COORDINATES}
        zoom={12}
        minZoom={10}
        className="h-full w-full"
        whenReady={() => {
          // Force a resize event after map is ready
          window.dispatchEvent(new Event('resize'));
        }}
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
    </div>
  );
};