import { Marker } from "react-leaflet";
import { Application } from "@/types/planning";
import { LatLngTuple } from "leaflet";
import { useMemo } from "react";
import L from "leaflet";

interface ApplicationMarkersProps {
  applications: Application[];
  baseCoordinates: LatLngTuple;
  onMarkerClick: (id: number) => void;
  selectedId: number | null;
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
  const size = isSelected ? 40 : 24;
  console.log(`Creating marker icon - Selected: ${isSelected}, Size: ${size}px`);

  return L.divIcon({
    className: `custom-marker-icon ${isSelected ? 'selected' : ''}`,
    html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="${color}"/>
    </svg>`,
    iconSize: [size, size],
    iconAnchor: [size/2, size],
  });
};

export const ApplicationMarkers = ({
  applications,
  baseCoordinates,
  onMarkerClick,
  selectedId,
}: ApplicationMarkersProps) => {
  console.log('ApplicationMarkers - Processing applications:', applications.length);
  console.log('Selected ID:', selectedId);

  return (
    <>
      {applications.map((app) => {
        const color = getStatusColor(app.status);
        const isSelected = app.id === selectedId;
        console.log(`Rendering marker ${app.id}:`, {
          isSelected,
          color,
          coordinates: app.coordinates
        });
        
        if (app.coordinates) {
          return (
            <Marker
              key={app.id}
              position={app.coordinates}
              eventHandlers={{
                click: () => {
                  console.log(`Marker clicked - Application ${app.id}`);
                  onMarkerClick(app.id);
                },
              }}
              icon={createIcon(color, isSelected)}
              zIndexOffset={isSelected ? 1000 : 0}
            />
          );
        }
        return null;
      })}
    </>
  );
};