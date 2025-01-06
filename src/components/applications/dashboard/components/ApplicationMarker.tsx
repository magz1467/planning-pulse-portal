import { Marker } from "react-leaflet";
import { Application } from "@/types/planning";
import L from "leaflet";

interface ApplicationMarkerProps {
  application: Application;
  isSelected: boolean;
  onClick: () => void;
}

const getStatusColor = (status: string): string => {
  console.log('Getting status color for:', status);
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
  const size = isSelected ? 40 : 24; // Increased size difference
  console.log(`Creating marker icon - Selected: ${isSelected}, Size: ${size}px, Color: ${color}`);
  
  return L.divIcon({
    className: `custom-marker-icon ${isSelected ? 'selected' : ''}`,
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="${color}"/>
    </svg>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size], // Anchor point adjusted for size
  });
};

export const ApplicationMarker = ({ application, isSelected, onClick }: ApplicationMarkerProps) => {
  console.log(`Rendering marker for application ${application.id}:`, {
    isSelected,
    coordinates: application.coordinates,
    status: application.status
  });

  if (!application.coordinates || !Array.isArray(application.coordinates)) {
    console.warn('Invalid coordinates for application:', application.id);
    return null;
  }

  const color = getStatusColor(application.status);
  const icon = createIcon(color, isSelected);

  const handleClick = () => {
    console.log(`Marker clicked - Application ${application.id}, Selected: ${isSelected}`);
    onClick();
  };

  return (
    <Marker
      position={application.coordinates}
      icon={icon}
      eventHandlers={{
        click: handleClick,
        mouseover: () => {
          console.log(`Marker hover - Application ${application.id}`);
        }
      }}
      zIndexOffset={isSelected ? 1000 : 0} // Ensure selected marker appears above others
    />
  );
};