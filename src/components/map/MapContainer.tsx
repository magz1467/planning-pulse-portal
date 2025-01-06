import { MapContainer as LeafletMapContainer, TileLayer, useMap } from "react-leaflet";
import { Application } from "@/types/planning";
import { ApplicationMarkers } from "./ApplicationMarkers";
import { useEffect, useRef, memo, useCallback } from "react";
import { Map as LeafletMap } from "leaflet";
import { SearchLocationPin } from "./SearchLocationPin";
import debounce from 'lodash/debounce';
import "leaflet/dist/leaflet.css";

// Separate component to handle map events
const MapEvents = ({ onCenterChange }: { onCenterChange?: (center: [number, number]) => void }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!onCenterChange) return;

    const debouncedCenterChange = debounce((center: [number, number]) => {
      onCenterChange(center);
    }, 1000);

    const handleMoveEnd = () => {
      const center = map.getCenter();
      debouncedCenterChange([center.lat, center.lng]);
    };

    map.on('moveend', handleMoveEnd);

    return () => {
      map.off('moveend', handleMoveEnd);
      debouncedCenterChange.cancel();
    };
  }, [map, onCenterChange]);

  return null;
};

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
}: MapContainerProps) => {
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView(coordinates, 14);
      setTimeout(() => {
        mapRef.current?.invalidateSize();
      }, 100);
    }
  }, [coordinates]);

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
        <MapEvents onCenterChange={onCenterChange} />
      </LeafletMapContainer>
    </div>
  );
});

MapContainerComponent.displayName = 'MapContainerComponent';