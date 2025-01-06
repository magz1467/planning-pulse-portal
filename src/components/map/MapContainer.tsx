import { Application } from "@/types/planning";
import { MapContainer } from "react-leaflet";
import { ApplicationMarkers } from "@/components/map/ApplicationMarkers";
import { useEffect, useRef } from "react";
import { Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";

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

  console.log('MapContainer - Rendering with:', {
    applicationsCount: applications.length,
    coordinates,
    selectedId
  });

  return (
    <MapContainer
      center={coordinates}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      ref={mapRef}
    >
      <ApplicationMarkers
        applications={applications}
        baseCoordinates={coordinates}
        onMarkerClick={onMarkerClick}
        selectedId={selectedId}
      />
    </MapContainer>
  );
};