import { Application } from "@/types/planning";
import { MapContainer } from "react-leaflet";
import { ApplicationMarkers } from "@/components/map/ApplicationMarkers";
import { useEffect, useRef, useState } from "react";
import { Map as LeafletMap, TileLayer } from "leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "@/components/ui/use-toast";

export interface MapContainerProps {
  applications: Application[];
  coordinates: [number, number];
  selectedId: number | null;
  onMarkerClick: (id: number) => void;
  onCenterChange?: (center: [number, number]) => void;
  onMapMove?: (map: LeafletMap) => void;
}

export const MapContainerComponent = ({
  applications,
  coordinates,
  selectedId,
  onMarkerClick,
  onCenterChange,
  onMapMove
}: MapContainerProps) => {
  const mapRef = useRef<LeafletMap | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (mapRef.current && onMapMove) {
      mapRef.current.on('move', () => {
        onMapMove(mapRef.current!);
      });
    }

    if (mapRef.current && onCenterChange) {
      mapRef.current.on('moveend', () => {
        const center = mapRef.current!.getCenter();
        onCenterChange([center.lat, center.lng]);
      });
    }
  }, [onMapMove, onCenterChange]);

  useEffect(() => {
    if (mapError) {
      toast({
        title: "Map Error",
        description: mapError,
        variant: "destructive"
      });
    }
  }, [mapError]);

  console.log('MapContainer - Rendering with:', {
    applicationsCount: applications.length,
    coordinates,
    selectedId
  });

  if (!coordinates) {
    return <div className="h-full w-full flex items-center justify-center">Loading map...</div>;
  }

  return (
    <MapContainer
      center={coordinates}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      ref={mapRef}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        onError={(e) => {
          console.error('Map tile error:', e);
          setMapError("Failed to load map tiles. Please check your internet connection.");
        }}
      />
      <ApplicationMarkers
        applications={applications}
        baseCoordinates={coordinates}
        onMarkerClick={onMarkerClick}
        selectedId={selectedId}
      />
    </MapContainer>
  );
};