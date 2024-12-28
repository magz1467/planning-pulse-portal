import { Map, List } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapListToggleProps {
  isMapView: boolean;
  onToggle: () => void;
}

export const MapListToggle = ({ isMapView, onToggle }: MapListToggleProps) => {
  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className={`px-2 ${isMapView ? "text-primary" : "text-gray-500"}`}
      >
        <Map className="h-5 w-5 mr-1" />
        Map
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className={`px-2 ${!isMapView ? "text-primary" : "text-gray-500"}`}
      >
        <List className="h-5 w-5 mr-1" />
        List
      </Button>
    </div>
  );
};