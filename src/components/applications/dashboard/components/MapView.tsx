import { Application } from "@/types/planning";
import { LatLngTuple } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import { ApplicationMarkers } from "@/components/map/ApplicationMarkers";
import { SearchLocationPin } from "@/components/map/SearchLocationPin";
import { useEffect } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
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
  const isMobile = useIsMobile();
  
  // Log the number of visible applications for debugging
  useEffect(() => {
    console.log('MapView - Number of applications:', applications.length);
  }, [applications]);

  // Set different zoom levels for mobile and desktop
  const defaultZoom = isMobile ? 13 : 15;

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={initialCenter as [number, number]}
        zoom={defaultZoom}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        minZoom={12}
        maxZoom={18}
      >
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />
        <SearchLocationPin position={initialCenter as [number, number]} />
        <ApplicationMarkers
          applications={applications}
          baseCoordinates={initialCenter as [number, number]}
          onMarkerClick={onMarkerClick}
          selectedId={selectedId}
        />
      </MapContainer>
    </div>
  );
};