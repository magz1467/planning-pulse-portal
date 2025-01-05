import { LatLngTuple } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import { ApplicationMarkers } from "@/components/map/ApplicationMarkers";
import { SearchLocationPin } from "@/components/map/SearchLocationPin";
import { useEffect } from 'react';
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  applications: any[];
  initialCenter: [number, number];
  baseCoordinates?: [number, number];
  onMarkerClick: (id: number) => void;
}

export const MapView = ({
  applications,
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
        center={initialCenter as LatLngTuple}
        zoom={15}
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
        <SearchLocationPin position={initialCenter} />
        <ApplicationMarkers
          applications={applications}
          baseCoordinates={initialCenter}
          onMarkerClick={onMarkerClick}
        />
      </MapContainer>
    </div>
  );
};