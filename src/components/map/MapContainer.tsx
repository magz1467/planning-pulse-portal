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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('MapContainer - Component mounted');
    return () => {
      console.log('MapContainer - Component unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('MapContainer - Coordinates changed:', coordinates);
    if (!coordinates) {
      console.error('MapContainer - Invalid coordinates:', coordinates);
      setError('Invalid coordinates provided');
      return;
    }

    if (mapRef.current) {
      try {
        console.log('MapContainer - Setting view to:', coordinates);
        mapRef.current.setView(coordinates, 14);
        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.invalidateSize();
            setIsLoading(false);
            console.log('MapContainer - Map initialized successfully');
          }
        }, 100);
      } catch (err) {
        console.error('MapContainer - Error setting map view:', err);
        setError('Error initializing map');
      }
    }
  }, [coordinates]);

  useEffect(() => {
    if (mapRef.current && onMapMove) {
      console.log('MapContainer - Setting up move handler');
      mapRef.current.on('move', () => {
        onMapMove(mapRef.current!);
      });
    }
  }, [onMapMove]);

  console.log('MapContainer - Rendering with:', {
    applicationsCount: applications.length,
    selectedId,
    coordinates,
    isLoading,
    error
  });

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

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