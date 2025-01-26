import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import { Application } from "@/types/planning";
import { SearchLocationPin } from "./SearchLocationPin";
import { MapInitializer } from "./components/MapInitializer";
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
    if (!mapRef.current) {
      console.log('Map not initialized yet, skipping effect...');
      return;
    }
    
    const map = mapRef.current;

    // Add vector tile source and layer
    if (!map.getSource('planning-applications')) {
      map.addSource('planning-applications', {
        type: 'vector',
        tiles: [`${window.location.origin}/functions/v1/fetch-searchland-mvt/{z}/{x}/{y}`],
        minzoom: 0,
        maxzoom: 22
      });

      map.addLayer({
        'id': 'planning-applications',
        'type': 'circle',
        'source': 'planning-applications',
        'source-layer': 'planning',
        'paint': {
          'circle-radius': 8,
          'circle-color': [
            'match',
            ['get', 'status'],
            'approved', '#16a34a',
            'refused', '#ea384c',
            '#F97316'
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });
    }

    // Add click handler for the vector tile layer
    map.on('click', 'planning-applications', (e) => {
      if (e.features && e.features[0]) {
        const feature = e.features[0];
        const id = feature.properties?.id;
        if (id) {
          console.log('Feature clicked:', feature);
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

    // Update when map moves
    const moveEndHandler = () => {
      if (!mapRef.current) return;
      if (onMapMove) {
        onMapMove(mapRef.current);
      }
    };

    map.on('moveend', moveEndHandler);

    return () => {
      if (!mapRef.current) return;
      
      const map = mapRef.current;
      
      map.off('moveend', moveEndHandler);
      
      // Proper cleanup of Mapbox layers and sources
      if (map.getLayer('planning-applications')) {
        map.removeLayer('planning-applications');
      }
      if (map.getSource('planning-applications')) {
        map.removeSource('planning-applications');
      }
    };

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
    </div>
  );
};