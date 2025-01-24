import { Application } from "@/types/planning";
import { useEffect, useRef, memo } from "react";
import { Map as LeafletMap } from "leaflet";
import { SearchLocationPin } from "./SearchLocationPin";
import mapboxgl from 'mapbox-gl';
import { supabase } from "@/integrations/supabase/client";
import "leaflet/dist/leaflet.css";
import "mapbox-gl/dist/mapbox-gl.css";

interface MapContainerProps {
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
  const mapboxRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize Mapbox GL map
    mapboxgl.accessToken = 'YOUR_MAPBOX_TOKEN'; // Replace with your token
    
    mapboxRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [coordinates[1], coordinates[0]], // Mapbox uses [lng, lat]
      zoom: 14
    });

    const map = mapboxRef.current;

    map.on('load', async () => {
      // Add vector tile source
      map.addSource('planning-applications', {
        type: 'vector',
        tiles: [
          `${supabase.functions.url('fetch-searchland-pins')}/{z}/{x}/{y}`
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
    });

    return () => {
      mapboxRef.current?.remove();
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