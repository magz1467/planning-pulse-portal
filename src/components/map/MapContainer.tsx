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

    // Add vector source for planning applications
    map.on('load', () => {
      // Check if source already exists
      if (!map.getSource('planning-applications')) {
        // Get the base URL for the Edge Function
        const functionUrl = 'https://jposqxdboetyioymfswd.supabase.co/functions/v1/fetch-searchland-pins'

        // Calculate bbox with a reasonable radius (roughly 5km)
        const [lat, lng] = coordinates;
        const radius = 0.05; // roughly 5km in degrees
        const bbox = `${lng - radius},${lat - radius},${lng + radius},${lat + radius}`;

        console.log('Initial bbox:', bbox);
        console.log('Using coordinates:', {lat, lng});

        map.addSource('planning-applications', {
          type: 'vector',
          scheme: 'xyz',
          tiles: [`${functionUrl}/{z}/{x}/{y}?bbox=${encodeURIComponent(bbox)}`],
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

        // Add click handler for the pins
        map.on('click', 'planning-applications', (e) => {
          if (e.features && e.features[0]) {
            const feature = e.features[0];
            const id = feature.properties?.id;
            if (id) {
              onMarkerClick(id);
            }
          }
        });

        // Change cursor on hover
        map.on('mouseenter', 'planning-applications', () => {
          map.getCanvas().style.cursor = 'pointer';
        });

        map.on('mouseleave', 'planning-applications', () => {
          map.getCanvas().style.cursor = '';
        });
      }
    });

    // Load pins when moving map
    map.on('moveend', () => {
      if (onMapMove) {
        const bounds = map.getBounds();
        const bbox = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
        console.log('Map moved, new bbox:', bbox);
        onMapMove(map);
      }
    });

  }, [onMapMove, onMarkerClick, coordinates]);

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