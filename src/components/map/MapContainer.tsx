import { Application } from "@/types/planning";
import { useEffect, useRef, memo } from "react";
import { MapContainer as LeafletMapContainer, TileLayer, Marker } from 'react-leaflet';
import { SearchLocationPin } from "./SearchLocationPin";
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
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map view
    mapRef.current.setView(coordinates, 14);

    // Add vector tile source
    const functionUrl = supabase.functions.url('fetch-searchland-pins');
    if (!functionUrl) {
      console.error('Failed to get function URL');
      return;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [coordinates]);

  return (
    <div className="w-full h-full relative">
      <LeafletMapContainer
        ref={mapRef}
        center={coordinates}
        zoom={14}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFyY29nZXJhZ2h0eSIsImEiOiJjbHNhcGZxbWowMGRqMmpxdGp2NmRwZnZsIn0.1-LG9BDX6gXeOPECXiVLrw"
          attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
        />
        {coordinates && <SearchLocationPin position={coordinates} />}
      </LeafletMapContainer>
    </div>
  );
});

MapContainerComponent.displayName = 'MapContainerComponent';