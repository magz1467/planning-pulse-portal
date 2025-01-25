import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import { Application } from "@/types/planning";
import { SearchLocationPin } from "./SearchLocationPin";
import { MapInitializer } from "./components/MapInitializer";
import { EventHandlers } from "./components/EventHandlers";
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

    map.on('load', async () => {
      if (sourceAddedRef.current) {
        console.log('Source already added, skipping...');
        return;
      }

      try {
        console.log('Adding source...');
        
        // Add vector tile source with complete URL
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl) {
          console.error('VITE_SUPABASE_URL is not defined');
          return;
        }

        map.addSource('planning-applications', {
          type: 'vector',
          tiles: [`${supabaseUrl}/functions/v1/fetch-searchland-mvt/{z}/{x}/{y}`],
          minzoom: 0,
          maxzoom: 22
        });

        // Add layer for planning applications
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

        sourceAddedRef.current = true;
        console.log('Successfully added source and layers');

        // Handle clicks on points
        map.on('click', 'planning-applications', (e) => {
          if (e.features && e.features[0].properties) {
            const id = e.features[0].properties.id;
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
      }
    });

    // Update source data when map moves
    map.on('moveend', async () => {
      if (!map) return;

      const bounds = map.getBounds();
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-searchland-data`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token}`
          },
          body: JSON.stringify({
            bbox: [
              bounds.getWest(),
              bounds.getSouth(),
              bounds.getEast(),
              bounds.getNorth()
            ]
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const source = map.getSource('planning-applications');
        
        if (source && 'setData' in source) {
          source.setData({
            type: 'FeatureCollection',
            features: data.applications.map((app: any) => ({
              type: 'Feature',
              geometry: app.geometry,
              properties: {
                id: app.properties.application_reference,
                status: app.properties.status.toLowerCase(),
                description: app.properties.description
              }
            }))
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }

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