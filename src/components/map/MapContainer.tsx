import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import { Application } from "@/types/planning";
import { SearchLocationPin } from "./SearchLocationPin";
import { MapInitializer } from "./components/MapInitializer";
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
  const sourceAddedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!mapRef.current) return;
    
    const map = mapRef.current;

    // Add vector source for planning applications
    map.on('load', () => {
      // Check if source already exists
      if (sourceAddedRef.current) {
        console.log('Vector tile source already added, skipping...');
        return;
      }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        console.error('VITE_SUPABASE_URL is not defined');
        return;
      }

      try {
        console.log('Adding vector tile source with URL:', `${supabaseUrl}/rest/v1/rpc/fetch_searchland_mvt/{z}/{x}/{y}`);
        
        map.addSource('planning-applications', {
          type: 'vector',
          tiles: [`${supabaseUrl}/rest/v1/rpc/fetch_searchland_mvt/{z}/{x}/{y}`],
          minzoom: 0,
          maxzoom: 14
        });

        map.addLayer({
          id: 'planning-applications',
          type: 'circle',
          source: 'planning-applications',
          'source-layer': 'planning',
          paint: {
            'circle-radius': 6,
            'circle-color': [
              'match',
              ['get', 'status'],
              'approved', '#16a34a',
              'refused', '#ea384c',
              '#F97316' // default orange
            ],
            'circle-opacity': 0.8
          }
        });

        sourceAddedRef.current = true;
        console.log('Successfully added vector tile source and layer');
      } catch (error) {
        console.error('Error adding vector tile source:', error);
      }
    });

    // Load pins when moving map
    map.on('moveend', () => {
      const bounds = map.getBounds();
      const zoom = Math.floor(map.getZoom());
      const center = map.getCenter();
      
      if (onMapMove) {
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
          <EventHandlers 
            map={mapRef.current}
            onMarkerClick={onMarkerClick}
          />
        </>
      )}
    </div>
  );
};