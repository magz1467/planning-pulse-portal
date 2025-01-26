import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import { Application } from "@/types/planning";
import { SearchLocationPin } from "./SearchLocationPin";
import { MapInitializer } from "./components/MapInitializer";
import { EventHandlers } from "./components/EventHandlers";
import "mapbox-gl/dist/mapbox-gl.css";
import { toast } from "sonner";

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
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});

  useEffect(() => {
    if (!mapRef.current) {
      console.log('Map not initialized yet, skipping effect...');
      return;
    }
    
    const map = mapRef.current;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add markers for each application
    applications.forEach(app => {
      if (!app.coordinates) return;

      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '16px';
      el.style.height = '16px';
      el.style.borderRadius = '50%';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';

      // Set color based on status
      if (app.status?.toLowerCase().includes('approved')) {
        el.style.backgroundColor = '#16a34a';
      } else if (app.status?.toLowerCase().includes('refused')) {
        el.style.backgroundColor = '#ea384c';
      } else {
        el.style.backgroundColor = '#F97316';
      }

      // Create and store marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([app.coordinates[1], app.coordinates[0]])
        .addTo(map);

      // Add click handler
      el.addEventListener('click', () => {
        onMarkerClick(app.id);
      });

      markersRef.current[app.id] = marker;
    });

    // Update when map moves
    map.on('moveend', () => {
      if (!map) return;
      if (onMapMove) {
        onMapMove(map);
      }
    });

  }, [applications, onMapMove, onMarkerClick]);

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
        <EventHandlers 
          map={mapRef.current}
          onMarkerClick={onMarkerClick}
        />
      )}
    </div>
  );
};