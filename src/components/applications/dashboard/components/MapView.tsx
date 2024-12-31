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

// Helper component to update map center and zoom
const MapUpdater = ({ center }: { center: LatLngTuple }) => {
  const map = useMap();
  
  useEffect(() => {
    // Calculate zoom level for approximately 1km radius view
    // Using zoom level 14 which typically shows about 1-2km radius
    const zoomLevel = 14;
    map.setView(center, zoomLevel);
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
    <div className="w-full h-full relative">
      <MapContainer
        ref={mapRef}
        center={initialCenter}
        zoom={14}
        className="w-full h-full"
        style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
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
    </div>
  );
};