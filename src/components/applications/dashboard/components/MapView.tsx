import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { Application } from "@/types/planning";
import { ApplicationMarker } from "./ApplicationMarker";
import { LatLngTuple } from "leaflet";

interface MapViewProps {
  applications: Application[];
  selectedId: number | null;
  onMarkerClick: (id: number) => void;
  initialCenter: LatLngTuple;
}

// Helper component to update map center
const MapUpdater = ({ center }: { center: LatLngTuple }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  
  return null;
};

export const MapView = ({
  applications,
  selectedId,
  onMarkerClick,
  initialCenter
}: MapViewProps) => {
  const mapRef = useRef(null);

  return (
    <MapContainer
      ref={mapRef}
      center={initialCenter}
      zoom={15}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapUpdater center={initialCenter} />
      
      {applications.map((application) => (
        <ApplicationMarker
          key={application.id}
          application={application}
          isSelected={application.id === selectedId}
          onClick={() => onMarkerClick(application.id)}
        />
      ))}
    </MapContainer>
  );
};