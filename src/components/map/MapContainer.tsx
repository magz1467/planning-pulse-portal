import { MapContainer as LeafletMapContainer, TileLayer } from "react-leaflet";
import { Application } from "@/types/planning";
import { ApplicationMarkers } from "./ApplicationMarkers";
import { useEffect, useRef, memo, useState } from "react";
import { Map as LeafletMap } from "leaflet";
import { SearchLocationPin } from "./SearchLocationPin";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import "leaflet/dist/leaflet.css";

export interface MapContainerProps {
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch Mapbox token from Supabase Edge Function
  useEffect(() => {
    const fetchMapboxToken = async () => {
      try {
        const { data: { token }, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) throw error;
        setMapboxToken(token);
      } catch (err) {
        console.error('Error fetching Mapbox token:', err);
        setError('Failed to load map configuration');
        toast({
          title: "Map Error",
          description: "Failed to load map configuration. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchMapboxToken();
  }, [toast]);

  useEffect(() => {
    console.log('MapContainer - Component mounted');
    console.log('Initial coordinates:', coordinates);
    console.log('Initial applications:', applications);
    
    return () => {
      console.log('MapContainer - Component unmounted');
    };
  }, []);

  useEffect(() => {
    console.log('MapContainer - Coordinates changed:', coordinates);
    if (!coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      const errorMsg = 'Invalid coordinates provided';
      console.error('MapContainer -', errorMsg, coordinates);
      setError(errorMsg);
      toast({
        title: "Map Error",
        description: errorMsg,
        variant: "destructive",
      });
      return;
    }

    if (mapRef.current) {
      try {
        console.log('MapContainer - Setting view to:', coordinates);
        mapRef.current.setView(coordinates, 14);
        
        const container = mapRef.current.getContainer();
        console.log('Map container dimensions:', {
          width: container.clientWidth,
          height: container.clientHeight,
          boundingRect: container.getBoundingClientRect()
        });

        setTimeout(() => {
          if (mapRef.current) {
            mapRef.current.invalidateSize();
            setIsLoading(false);
            console.log('MapContainer - Map initialized successfully');
          }
        }, 100);
      } catch (err) {
        const errorMsg = 'Error setting map view';
        console.error('MapContainer -', errorMsg, err);
        setError(errorMsg);
        toast({
          title: "Map Error",
          description: errorMsg,
          variant: "destructive",
        });
      }
    }
  }, [coordinates, toast]);

  useEffect(() => {
    if (mapRef.current && onMapMove) {
      console.log('MapContainer - Setting up move handler');
      mapRef.current.on('move', () => {
        onMapMove(mapRef.current!);
      });
    }
  }, [onMapMove]);

  console.log('MapContainer - Rendering with:', {
    applicationsCount: applications.length,
    selectedId,
    coordinates,
    isLoading,
    error
  });

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (isLoading || !mapboxToken) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <LeafletMapContainer
        ref={mapRef}
        center={coordinates}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer 
          url={`https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=${mapboxToken}`}
          attribution='© <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
          maxZoom={19}
        />
        <SearchLocationPin position={coordinates} />
        <ApplicationMarkers
          applications={applications}
          baseCoordinates={coordinates}
          onMarkerClick={onMarkerClick}
          selectedId={selectedId}
        />
      </LeafletMapContainer>
    </div>
  );
});

MapContainerComponent.displayName = 'MapContainerComponent';