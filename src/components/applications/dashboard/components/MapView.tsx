import { MapContainerComponent } from "@/components/map/MapContainer";
import { Application } from "@/types/planning";
import { memo, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";

interface MapViewProps {
  applications: Application[];
  selectedId: number | null;
  coordinates: [number, number];
  onMarkerClick: (id: number) => void;
  onCenterChange?: (center: [number, number]) => void;
  onMapMove?: (map: any) => void;
}

export const MapView = memo(({
  applications,
  selectedId,
  coordinates,
  onMarkerClick,
  onCenterChange,
  onMapMove,
}: MapViewProps) => {
  // Handle resource loading errors
  useEffect(() => {
    const handleResourceError = (error: ErrorEvent) => {
      if (error.message.includes('Failed to load resource')) {
        console.warn('Resource loading error:', error);
        toast({
          title: "Resource Loading Issue",
          description: "Some map resources failed to load. Please refresh the page.",
          variant: "destructive",
        });
      }
    };

    window.addEventListener('error', handleResourceError);
    return () => window.removeEventListener('error', handleResourceError);
  }, []);

  return (
    <div className="absolute inset-0">
      <MapContainerComponent
        applications={applications}
        coordinates={coordinates}
        selectedId={selectedId}
        onMarkerClick={onMarkerClick}
        onCenterChange={onCenterChange}
        onMapMove={onMapMove}
      />
    </div>
  );
});

MapView.displayName = 'MapView';