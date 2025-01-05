import { Application } from "@/types/planning";
import { LatLngTuple } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import { ApplicationMarkers } from "@/components/map/ApplicationMarkers";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  applications: Application[];
  selectedId: number | null;
  initialCenter: LatLngTuple;
  onMarkerClick: (id: number) => void;
}

export const MapView = ({
  applications,
  selectedId,
  initialCenter,
  onMarkerClick,
}: MapViewProps) => {
  useEffect(() => {
    // Force map to update its size when container size changes
    window.dispatchEvent(new Event('resize'));
  }, []);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={initialCenter}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ApplicationMarkers
          applications={applications}
          baseCoordinates={initialCenter}
          onMarkerClick={onMarkerClick}
          selectedId={selectedId}
        />
      </MapContainer>
    </div>
  );
};