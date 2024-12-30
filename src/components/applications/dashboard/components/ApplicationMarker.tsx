import { Marker } from "react-leaflet";
import { Application } from "@/types/planning";
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
    />
  );
};