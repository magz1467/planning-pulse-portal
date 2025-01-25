import { Application } from "@/types/planning";
import { useEffect, useRef, memo } from "react";
import mapboxgl from 'mapbox-gl';
import { SearchLocationPin } from "./SearchLocationPin";
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
    mapboxgl.accessToken = 'pk.eyJ1IjoibWFyY29nZXJhZ2h0eSIsImEiOiJjbHNhcGZxbWowMGRqMmpxdGp2NmRwZnZsIn0.1-LG9BDX6gXeOPECXiVLrw';
    
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [coordinates[1], coordinates[0]], // Mapbox uses [lng, lat]
      zoom: 14
    });

    const map = mapRef.current;

    map.on('load', async () => {
      // Add vector tile source
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-searchland-pins`;
      if (!functionUrl) {
        console.error('Failed to get function URL');
        return;
      }

      map.addSource('planning-applications', {
        type: 'vector',
        tiles: [
          `${functionUrl}/{z}/{x}/{y}`
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
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [coordinates]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
      {coordinates && <SearchLocationPin position={coordinates} />}
    </div>
  );
});

MapContainerComponent.displayName = 'MapContainerComponent';