import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MapContent } from "@/components/map/MapContent";
import { useIsMobile } from "@/hooks/use-mobile";

const MapView = () => {
  const isMobile = useIsMobile();
  
  return (
    <ErrorBoundary>
      <MapContent 
        applications={[]}
        selectedId={null}
        coordinates={[51.5074, -0.1278]} // Default to London coordinates
        isMobile={isMobile}
        isMapView={true}
        onMarkerClick={() => {}}
      />
    </ErrorBoundary>
  );
};

export default MapView;