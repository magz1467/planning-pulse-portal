import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import { Application } from "@/types/planning";
import { SearchLocationPin } from "./SearchLocationPin";
import { MapInitializer } from "./components/MapInitializer";
import { VectorTileLayer } from "./components/VectorTileLayer";
import { EventHandlers } from "./components/EventHandlers";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapContainerProps {
  coordinates: [number, number];
  applications: Application[];
  selectedId?: number | null;
  onMarkerClick: (id: number) => void;
  onCenterChange?: (center: [number, number]) => void;
  onMapMove?: (map: any) => void;
}

export const MapContainerComponent = ({
  coordinates,
  applications,
  selectedId,
  onMarkerClick,
  onCenterChange,
  onMapMove,
}: MapContainerProps) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    
    const map = mapRef.current;

    // Load pins when moving map
    map.on('moveend', () => {
      if (onMapMove) {
        const bounds = map.getBounds();
        const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
        console.log('Map moved, new bbox:', bbox);
        onMapMove(map);
      }
    });

  }, [onMapMove]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
      <SearchLocationPin position={coordinates} />
      <MapInitializer 
        mapContainer={mapContainerRef}
        mapRef={mapRef}
        coordinates={coordinates}
      />
      {mapRef.current && (
        <>
          <VectorTileLayer map={mapRef.current} />
          <EventHandlers 
            map={mapRef.current}
            onMarkerClick={onMarkerClick}
          />
        </>
      )}
    </div>
  );
};