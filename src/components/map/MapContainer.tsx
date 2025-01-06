import { MapContainer as LeafletMapContainer, TileLayer } from "react-leaflet";
import { Application } from "@/types/planning";
import { ApplicationMarkers } from "./ApplicationMarkers";
import { useEffect, useRef, memo, useState } from "react";
import { Map as LeafletMap } from "leaflet";
import { SearchLocationPin } from "./SearchLocationPin";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  const [tileLoadErrors, setTileLoadErrors] = useState(0);
  const { toast } = useToast();
  const MAX_TILE_LOAD_RETRIES = 3;

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
        
        // Debug map container dimensions
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

  const handleTileError = (error: any) => {
    console.error('Tile loading error:', error);
    setTileLoadErrors(prev => {
      const newCount = prev + 1;
      if (newCount >= MAX_TILE_LOAD_RETRIES) {
        toast({
          title: "Map Error",
          description: "Failed to load map tiles. Trying alternative source.",
          variant: "destructive",
        });
      }
      return newCount;
    });
  };

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-50">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
      </div>
    );
  }

  // Primary tile layer with fallback
  const primaryTileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  const fallbackTileUrl = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

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
          url={tileLoadErrors >= MAX_TILE_LOAD_RETRIES ? fallbackTileUrl : primaryTileUrl}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
          eventHandlers={{
            tileerror: handleTileError
          }}
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