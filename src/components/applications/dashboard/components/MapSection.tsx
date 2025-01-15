import { Application } from "@/types/planning";
import { MapView } from "@/components/map/MapView";
import { MobileApplicationCards } from "@/components/map/mobile/MobileApplicationCards";
import { memo } from "react";

export interface MapSectionProps {
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
  console.log('MapSection rendering with:', {
    applicationsCount: applications?.length,
    selectedId,
    coordinates
  });

  if (!coordinates || (!isMobile && !isMapView)) return null;

  return (
    <div className="flex-1 relative">
      <div className="absolute inset-0">
        <MapView
          applications={applications}
          selectedId={selectedId}
          coordinates={coordinates}
          onMarkerClick={onMarkerClick}
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