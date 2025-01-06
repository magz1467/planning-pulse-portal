import { Application } from "@/types/planning";
import { MapView } from "./MapView";
import { MobileApplicationCards } from "@/components/map/mobile/MobileApplicationCards";
import { RedoSearchButton } from "@/components/map/RedoSearchButton";
import { useState } from "react";

interface MapSectionProps {
  isMobile: boolean;
  isMapView: boolean;
  coordinates: [number, number];
  applications: Application[];
  selectedId: number | null;
  onMarkerClick: (id: number | null) => void;
  onCenterChange?: (center: [number, number]) => void;
}

export const MapSection = ({
  isMobile,
  isMapView,
  coordinates,
  applications,
  selectedId,
  onMarkerClick,
  onCenterChange,
}: MapSectionProps) => {
  const [hasMapMoved, setHasMapMoved] = useState(false);

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
          onMarkerClick={onMarkerClick}
          onCenterChange={onCenterChange}
          onMapMove={(map) => {
            const bounds = map.getBounds();
            const isAnyMarkerVisible = applications.some(app => {
              if (!app.centroid?.coordinates) return false;
              const [lng, lat] = app.centroid.coordinates;
              return bounds.contains([lat, lng]);
            });
            setHasMapMoved(!isAnyMarkerVisible);
          }}
        />
        {onCenterChange && hasMapMoved && (
          <RedoSearchButton onClick={() => {
            const map = document.querySelector('.leaflet-container');
            // @ts-ignore - we know this exists because Leaflet adds it
            const leafletMap = map?._leaflet_map;
            if (leafletMap) {
              const center = leafletMap.getCenter();
              onCenterChange([center.lat, center.lng]);
              setHasMapMoved(false);
            }
          }} />
        )}
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
};