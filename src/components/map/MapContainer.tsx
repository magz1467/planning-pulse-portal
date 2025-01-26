import { useEffect, useRef } from "react";
import mapboxgl from 'mapbox-gl';
import { Application } from "@/types/planning";
import { SearchLocationPin } from "./SearchLocationPin";
import { MapInitializer } from "./components/MapInitializer";
import L from 'leaflet';
import 'leaflet.vectorgrid';
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
  const mvtLayerRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) {
      console.log('Map not initialized yet, skipping effect...');
      return;
    }
    
    const map = mapRef.current;

    // Remove existing MVT layer if it exists
    if (mvtLayerRef.current) {
      map.removeLayer(mvtLayerRef.current);
    }

    // Add vector tile source
    const mvtLayer = L.vectorGrid.protobuf(
      `${window.location.origin}/functions/v1/fetch-searchland-mvt/{z}/{x}/{y}`,
      {
        vectorTileLayerStyles: {
          planning: {
            color: "#F97316", // Default orange color
            fillColor: "#F97316",
            fillOpacity: 0.6,
            weight: 1,
            opacity: 0.8
          }
        },
        getFeatureId: (feature) => {
          if (feature.type === 4) { // Skip MULTIPOINT type
            console.warn("Skipping unsupported geometry type: 4");
            return null;
          }
          return feature.properties?.id;
        },
        interactive: true, // Make features clickable
        rendererFactory: L.canvas.tile,
        maxNativeZoom: 16,
        tolerance: 5,
        debug: 0
      }
    );

    // Add click handler
    mvtLayer.on('click', (e: any) => {
      if (e.layer && e.layer.properties) {
        console.log('MVT feature clicked:', e.layer.properties);
        onMarkerClick(e.layer.properties.id);
      }
    });

    // Store reference to layer for cleanup
    mvtLayerRef.current = mvtLayer;

    // Add the layer to map
    mvtLayer.addTo(map);

    // Update when map moves
    const moveEndHandler = () => {
      if (!map) return;
      if (onMapMove) {
        onMapMove(map);
      }
    };

    map.on('moveend', moveEndHandler);

    return () => {
      map.off('moveend', moveEndHandler);
      if (mvtLayerRef.current) {
        map.removeLayer(mvtLayerRef.current);
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