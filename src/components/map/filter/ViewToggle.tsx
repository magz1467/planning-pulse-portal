import { Button } from "@/components/ui/button";
import { Map, List } from "lucide-react";

interface ViewToggleProps {
  isMapView: boolean;
  onToggle: () => void;
}

export const ViewToggle = ({ isMapView, onToggle }: ViewToggleProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className={isMapView ? "text-primary" : "text-gray-500"}
      >
        <Map className="h-5 w-5 mr-1" />
        Map
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className={!isMapView ? "text-primary" : "text-gray-500"}
      >
        <List className="h-5 w-5 mr-1" />
        Feed
      </Button>
    </div>
  );
};