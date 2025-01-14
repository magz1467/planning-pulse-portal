import { Application } from "@/types/planning";
import { MapView } from "./MapView";
import { MobileApplicationCards } from "@/components/map/mobile/MobileApplicationCards";
import { useCallback, memo, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface MapSectionProps {
  isMobile: boolean;
  isMapView: boolean;
  coordinates: [number, number];
  applications: Application[];
  selectedId: number | null;
  onMarkerClick: (id: number | null) => void;
  onCenterChange?: (center: [number, number]) => void;
}

export const MapSection = memo(({
  isMobile,
  isMapView,
  coordinates,
  applications,
  selectedId,
  onMarkerClick,
  onCenterChange,
}: MapSectionProps) => {
  const handleMarkerClick = useCallback((id: number | null) => {
    console.log('MapSection handleMarkerClick:', id);
    // Force the click to be handled synchronously
    setTimeout(() => {
      onMarkerClick(id);
    }, 0);
  }, [onMarkerClick]);

  // Handle WebSocket errors gracefully
  useEffect(() => {
    const handleWebSocketError = (error: Event) => {
      console.warn('WebSocket connection error:', error);
      toast({
        title: "Connection Issue",
        description: "Having trouble maintaining connection. Will retry automatically.",
        variant: "destructive",
      });
    };

    window.addEventListener('error', (event) => {
      if (event.message.includes('WebSocket')) {
        handleWebSocketError(event);
      }
    });

    return () => {
      window.removeEventListener('error', handleWebSocketError);
    };
  }, []);

  if (!coordinates || (!isMobile && !isMapView)) return null;

  return (
    <div 
      className="flex-1 relative"
      style={{ 
        height: isMobile ? 'calc(100vh - 120px)' : '100%',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div className="absolute inset-0">
        <MapView
          applications={applications}
          selectedId={selectedId}
          coordinates={coordinates}
          onMarkerClick={handleMarkerClick}
          onCenterChange={onCenterChange}
        />
        {isMobile && selectedId && (
          <MobileApplicationCards
            applications={applications}
            selectedId={selectedId}
            onSelectApplication={onMarkerClick}
          />
        )}
      </div>
    </div>
  );
});

MapSection.displayName = 'MapSection';