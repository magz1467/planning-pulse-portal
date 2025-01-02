import { Application } from "@/types/planning";
import { MapView } from "./MapView";
import { MobileApplicationCards } from "@/components/map/mobile/MobileApplicationCards";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MapContentProps {
  applications: Application[];
  selectedId: number | null;
  coordinates: [number, number];
  isMobile: boolean;
  isMapView: boolean;
  onMarkerClick: (id: number | null) => void;
}

export const MapContent = ({
  applications,
  selectedId,
  coordinates,
  isMobile,
  isMapView,
  onMarkerClick,
}: MapContentProps) => {
  const { toast } = useToast();
  const [showRedoSearch, setShowRedoSearch] = useState(false);
  const [newCenter, setNewCenter] = useState<[number, number] | null>(null);

  const handleMapMoved = (center: [number, number], bounds: [[number, number], [number, number]]) => {
    // Check if any applications are within current bounds
    const hasApplicationsInView = applications.some(app => {
      if (!app.coordinates) return false;
      return app.coordinates[0] >= bounds[0][0] && 
             app.coordinates[0] <= bounds[1][0] && 
             app.coordinates[1] >= bounds[0][1] && 
             app.coordinates[1] <= bounds[1][1];
    });

    setShowRedoSearch(!hasApplicationsInView);
    setNewCenter(center);
  };

  const handleRedoSearch = () => {
    if (!newCenter) return;
    
    // Update coordinates which will trigger a new search
    coordinates = newCenter;
    
    toast({
      title: "Searching new area",
      description: "Updating results for the current map view",
    });

    setShowRedoSearch(false);
  };

  if (!coordinates || (!isMobile && !isMapView)) return null;

  return (
    <div className="flex-1 relative h-full">
      <div 
        className="absolute inset-0"
        style={{ 
          height: isMobile ? 'calc(100vh - 120px)' : '100%',
          position: 'relative',
          zIndex: 1
        }}
      >
        <MapView
          applications={applications}
          selectedId={selectedId}
          onMarkerClick={onMarkerClick}
          initialCenter={coordinates}
          onMapMoved={handleMapMoved}
        />
        {isMobile && selectedId && (
          <MobileApplicationCards
            applications={applications}
            selectedId={selectedId}
            onSelectApplication={onMarkerClick}
          />
        )}
        {showRedoSearch && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50">
            <Button 
              onClick={handleRedoSearch}
              className="bg-primary text-white shadow-lg hover:bg-primary/90"
            >
              <Search className="w-4 h-4 mr-2" />
              Search this area
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};