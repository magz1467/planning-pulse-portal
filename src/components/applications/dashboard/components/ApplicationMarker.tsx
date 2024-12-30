import { Marker, Popup } from "react-leaflet";
import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { applicationIcon, selectedApplicationIcon } from "@/components/map/MapMarkers";

interface ApplicationMarkerProps {
  application: Application;
  isSelected: boolean;
  onClick: () => void;
}

export const ApplicationMarker = ({ application, isSelected, onClick }: ApplicationMarkerProps) => {
  return (
    <Marker
      position={application.coordinates}
      icon={isSelected ? selectedApplicationIcon : applicationIcon}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup>
        <Card className="p-4">
          <h3 className="font-semibold mb-2">{application.title}</h3>
          <p className="text-sm text-gray-600">{application.address}</p>
          <p className="text-sm text-gray-600 mt-1">Status: {application.status}</p>
          <Button 
            className="mt-2 w-full"
            onClick={onClick}
          >
            View Details
          </Button>
        </Card>
      </Popup>
    </Marker>
  );
};