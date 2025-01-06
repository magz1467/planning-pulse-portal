import { MapContainer as LeafletMapContainer, TileLayer } from "react-leaflet";
import { Application } from "@/types/planning";
import { ApplicationMarkers } from "./ApplicationMarkers";
import { useEffect, useRef, memo, useState } from "react";
import { Map as LeafletMap } from "leaflet";
import { SearchLocationPin } from "./SearchLocationPin";
import { Loader2 } from "lucide-react";
import "leaflet/dist/leaflet.css";

export interface MapContainerProps {
  applications: Application[];
  coordinates: [number, number];
  selectedId?: number | null;
  onMarkerClick: (id: number) => void;
  onCenterChange?: (center: [number, number]) => void;
  onMapMove?: (map: LeafletMap) => void;
}

export const MapContainerComponent = memo(({
  coordinates,
  applications,
  selectedId,
  onMarkerClick,
  onCenterChange,
  onMapMove,
}: MapContainerProps) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('MapContainer - Coordinates changed:', coordinates);
    if (mapRef.current) {
      mapRef.current.setView(coordinates, 14);
      setTimeout(() => {
        mapRef.current?.invalidateSize();
        setIsLoading(false);
      }, 100);
    }
  }, [coordinates]);

  useEffect(() => {
    if (mapRef.current && onMapMove) {
      mapRef.current.on('move', () => {
        onMapMove(mapRef.current!);
      });
    }
  }, [onMapMove]);

  console.log('MapContainer - Rendering with:', {
    applicationsCount: applications.length,
    selectedId,
    coordinates
  });

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <LeafletMapContainer
        ref={mapRef}
        center={coordinates}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          maxZoom={19}
        />
        <SearchLocationPin position={coordinates} />
        <ApplicationMarkers
          applications={applications}
          baseCoordinates={coordinates}
          onMarkerClick={onMarkerClick}
          selectedId={selectedId}
        />
      </LeafletMapContainer>
    </div>
  );
});

MapContainerComponent.displayName = 'MapContainerComponent';