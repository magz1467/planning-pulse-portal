import { Application } from "@/types/planning";
import { useEffect, useRef, memo } from "react";
import { SearchLocationPin } from "./SearchLocationPin";
import mapboxgl from 'mapbox-gl';
import { supabase } from "@/integrations/supabase/client";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapContainerProps {
  coordinates: [number, number];
  applications: Application[];
  selectedId?: number | null;
  onMarkerClick: (id: number) => void;
  onCenterChange?: (center: [number, number]) => void;
  onMapMove?: (map: any) => void;
}

export const MapContainerComponent = memo(({
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
    if (!mapContainerRef.current) return;

    // Initialize Mapbox GL map
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFyY29hZyIsImEiOiJjajhvb2NyOWYwNXRhMnJvMDNtYjh4NmdxIn0.wUpTbsVWQuPwRHDwpnCznA';
    
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [coordinates[1], coordinates[0]], // Mapbox uses [lng, lat]
      zoom: 14
    });

    const map = mapRef.current;

    map.on('load', async () => {
      try {
        // Get the function URL using the Supabase client
        const { data: { url } } = await supabase.functions.invoke('fetch-searchland-pins', {
          method: 'GET'
        });

        if (!url) {
          console.error('Failed to get function URL');
          return;
        }

        // Add vector tile source
        map.addSource('planning-applications', {
          type: 'vector',
          tiles: [
            `${url}/{z}/{x}/{y}`
          ],
          minzoom: 10,
          maxzoom: 16
        });

        // Add layer for planning applications
        map.addLayer({
          id: 'planning-applications',
          type: 'circle',
          source: 'planning-applications',
          'source-layer': 'planning_applications',
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

        // Handle clicks
        map.on('click', 'planning-applications', (e) => {
          if (!e.features?.length) return;
          
          const feature = e.features[0];
          onMarkerClick(feature.properties.id);
        });

        // Change cursor on hover
        map.on('mouseenter', 'planning-applications', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        
        map.on('mouseleave', 'planning-applications', () => {
          map.getCanvas().style.cursor = '';
        });
      } catch (error) {
        console.error('Error initializing map:', error);
      }
    });

    return () => {
      mapRef.current?.remove();
    };
  }, [coordinates]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
      <SearchLocationPin position={coordinates} />
    </div>
  );
});

MapContainerComponent.displayName = 'MapContainerComponent';