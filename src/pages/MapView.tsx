import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MapContent } from "@/components/map/MapContent";

const MapView = () => {
  return (
    <ErrorBoundary>
      <MapContent />
    </ErrorBoundary>
  );
};

export default MapView;