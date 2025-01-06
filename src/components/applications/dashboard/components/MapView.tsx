import { useEffect, useState } from "react";
import { RedoSearchButton } from "@/components/map/RedoSearchButton";
import { MapContainer } from "@/components/map/layout/components/MapContainer";
import { MobileApplicationCards } from "@/components/map/mobile/MobileApplicationCards";
import { Application } from "@/types/planning";

interface MapViewProps {
  applications: Application[];
  selectedId: number | null;
  coordinates: [number, number];
  isMobile: boolean;
  isMapView: boolean;
  onMarkerClick: (id: number | null) => void;
  onCenterChange: (center: [number, number]) => void;
}

const RedoSearchControl = ({ onRedoSearch }: { onRedoSearch: (center: [number, number]) => void }) => {
  const [showRedoSearch, setShowRedoSearch] = useState(false);

  useEffect(() => {
    const handleMapMove = () => {
      setShowRedoSearch(true);
    };

    window.addEventListener('map-move', handleMapMove);

    return () => {
      window.removeEventListener('map-move', handleMapMove);
    };
  }, []);

  const handleRedoSearch = () => {
    const mapCenter = window.map?.getCenter();
    if (mapCenter) {
      onRedoSearch([mapCenter.lat, mapCenter.lng]);
    }
    setShowRedoSearch(false);
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {showRedoSearch && (
        <div className="relative w-full h-full">
          <RedoSearchButton onClick={handleRedoSearch} />
        </div>
      )}
    </div>
  );
};

export const MapView = ({
  applications,
  selectedId,
  coordinates,
  isMobile,
  isMapView,
  onMarkerClick,
  onCenterChange,
}: MapViewProps) => {
  return (
    <div className="relative flex-1 w-full">
      <MapContainer
        applications={applications}
        selectedId={selectedId}
        coordinates={coordinates}
        onMarkerClick={onMarkerClick}
        onCenterChange={onCenterChange}
      />
      <RedoSearchControl onRedoSearch={onCenterChange} />
      {isMobile && isMapView && (
        <MobileApplicationCards
          applications={applications}
          selectedId={selectedId}
          onSelectApplication={onMarkerClick}
        />
      )}
    </div>
  );
};