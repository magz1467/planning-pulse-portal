import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import { Application } from "@/types/planning";
import { SearchLocationPin } from "./SearchLocationPin";
import { MapInitializer } from "./components/MapInitializer";
import { VectorTileLayer } from "./components/VectorTileLayer";
import { EventHandlers } from "./components/EventHandlers";
import "mapbox-gl/dist/mapbox-gl.css";
import { supabase } from "@/integrations/supabase/client";

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

  const fetchPinsForTile = async (z: number, x: number, y: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-searchland-pins', {
        body: { z, x, y }
      });

      if (error) {
        console.error('Error fetching pins:', error);
        return [];
      }

      return data.pins || [];
    } catch (error) {
      console.error('Error invoking function:', error);
      return [];
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;
    
    const map = mapRef.current;

    // Add vector source for planning applications
    map.on('load', () => {
      map.addSource('planning-applications', {
        type: 'vector',
        scheme: 'xyz',
        tiles: [`${supabase.functions.url}/fetch-searchland-pins/{z}/{x}/{y}`],
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
    });

    // Load pins when moving map
    map.on('moveend', () => {
      const bounds = map.getBounds();
      const zoom = Math.floor(map.getZoom());
      const center = map.getCenter();
      
      // Convert bounds to tile coordinates
      const tile = pointToTile(center.lng, center.lat, zoom);
      if (tile) {
        fetchPinsForTile(zoom, tile.x, tile.y);
      }
      
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

// Helper function to convert lat/lng to tile coordinates
function pointToTile(lon: number, lat: number, z: number) {
  if (isNaN(lon) || isNaN(lat) || isNaN(z)) return null;
  
  const tile = {
    x: Math.floor((lon + 180) / 360 * Math.pow(2, z)),
    y: Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, z))
  };
  
  return tile;
}