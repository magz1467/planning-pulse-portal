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

  useEffect(() => {
    if (!mapRef.current) {
      console.log('Map not initialized yet, skipping effect...');
      return;
    }
    
    const map = mapRef.current;
    console.log('Map initialized, setting up vector tiles...');

    map.on('load', async () => {
      try {
        // Add vector tile source with complete URL
        map.addSource('planning-applications', {
          type: 'vector',
          tiles: ['https://jposqxdboetyioymfswd.supabase.co/functions/v1/fetch-searchland-mvt/{z}/{x}/{y}'],
          minzoom: 0,
          maxzoom: 22,
          scheme: "xyz",
          tileSize: 512
        });

        // Add circle layer for planning applications
        map.addLayer({
          'id': 'planning-applications',
          'type': 'circle',
          'source': 'planning-applications',
          'source-layer': 'planning',
          'paint': {
            'circle-color': [
              'match',
              ['get', 'status'],
              'approved', '#16a34a',
              'refused', '#ea384c',
              '#F97316' // default orange
            ],
            'circle-radius': 8,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff'
          }
        });

        // Handle clicks on points
        map.on('click', 'planning-applications', (e) => {
          if (e.features && e.features[0].properties) {
            const id = e.features[0].properties.id;
            console.log('Clicked application ID:', id);
            onMarkerClick(id);
          }
        });

        // Change cursor on hover
        map.on('mouseenter', 'planning-applications', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        
        map.on('mouseleave', 'planning-applications', () => {
          map.getCanvas().style.cursor = '';
        });

      } catch (error) {
        console.error('Error adding source:', error);
        toast.error('Error loading planning application data');
      }
    });

    // Update when map moves
    map.on('moveend', () => {
      if (!map) return;
      if (onMapMove) {
        onMapMove(map);
      }
    });

  }, [onMapMove, onMarkerClick]);

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