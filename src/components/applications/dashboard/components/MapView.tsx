import { Application } from "@/types/planning";
import { LatLngTuple } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import { ApplicationMarkers } from "@/components/map/ApplicationMarkers";
import { useEffect } from 'react';
import "leaflet/dist/leaflet.css";

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
  initialCenter
}: MapViewProps) => {
  // Log the number of visible applications for debugging
  useEffect(() => {
    console.log('MapView - Number of applications:', applications.length);
  }, [applications]);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={initialCenter}
        zoom={15} // Increased from 14 for closer initial view
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        // Add some additional map options for better initial view
        zoomControl={true}
        minZoom={12} // Prevent zooming out too far
        maxZoom={18}
      >
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
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