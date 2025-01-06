import { Marker } from "react-leaflet";
import { Application } from "@/types/planning";
import L from "leaflet";

interface ApplicationMarkerProps {
  application: Application;
  isSelected: boolean;
  onClick: () => void;
}

const getStatusColor = (status: string): string => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('approved')) {
    return '#16a34a'; // green
  } else if (statusLower.includes('refused') || statusLower.includes('declined') || statusLower.includes('withdrawn')) {
    return '#ea384c'; // red
  } else {
    return '#F97316'; // orange for under consideration/pending
  }
};

const createIcon = (color: string, isSelected: boolean) => {
  console.log('Creating icon with selected state:', isSelected); // Debug log
  const size = isSelected ? 32 : 24;
  const icon = L.divIcon({
    className: 'bg-transparent',
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="${color}"/>
    </svg>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size],
  });
  console.log('Icon created with size:', size); // Debug icon size
  return icon;
}

export const ApplicationMarker = ({ application, isSelected, onClick }: ApplicationMarkerProps) => {
  console.log('ApplicationMarker render - Application:', application.id, 'Selected:', isSelected); // Debug log
  console.log('Application coordinates:', application.coordinates); // Debug coordinates
  
  const color = getStatusColor(application.status);
  console.log('Status color:', color); // Debug color
  
  const icon = createIcon(color, isSelected);
  console.log('Icon object:', icon); // Debug icon object

  return (
    <Marker
      position={application.coordinates}
      icon={icon}
      eventHandlers={{
        click: () => {
          console.log('Marker clicked - Application:', application.id); // Debug click
          onClick();
        },
      }}
    />
  );
};