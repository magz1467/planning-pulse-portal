import { Application } from "@/types/planning";
import { LatLngTuple } from "leaflet";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { ApplicationMarkers } from "@/components/map/ApplicationMarkers";
import { SearchLocationPin } from "@/components/map/SearchLocationPin";
import { useEffect, useState } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";
import { RedoSearchButton } from "@/components/map/RedoSearchButton";
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  applications: Application[];
  selectedId: number | null;
  onMarkerClick: (id: number) => void;
  initialCenter: LatLngTuple;
  onCenterChange?: (center: LatLngTuple) => void;
}

const MapController = ({ 
  applications, 
  onCenterChange 
}: { 
  applications: Application[],
  onCenterChange?: (center: LatLngTuple) => void 
}) => {
  const map = useMap();
  const [showRedoSearch, setShowRedoSearch] = useState(false);

  useMapEvents({
    moveend: () => {
      // Check if any markers are visible in the current view
      const bounds = map.getBounds();
      const isAnyMarkerVisible = applications.some(app => {
        if (!app.coordinates) return false;
        return bounds.contains([app.coordinates[0], app.coordinates[1]]);
      });
      
      setShowRedoSearch(!isAnyMarkerVisible);
    }
  });

  const handleRedoSearch = () => {
    const center = map.getCenter();
    onCenterChange?.([center.lat, center.lng]);
    setShowRedoSearch(false);
  };

  return showRedoSearch ? <RedoSearchButton onClick={handleRedoSearch} /> : null;
};

export const MapView = ({
  applications,
  selectedId,
  onMarkerClick,
  initialCenter,
  onCenterChange
}: MapViewProps) => {
  const isMobile = useIsMobile();
  
  useEffect(() => {
    console.log('MapView - Number of applications:', applications.length);
  }, [applications]);

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
        <MapController 
          applications={applications}
          onCenterChange={onCenterChange}
        />
      </MapContainer>
    </div>
  );
};