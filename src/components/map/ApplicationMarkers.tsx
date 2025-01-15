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
  
  // Create a div element for the marker
  const markerHtml = document.createElement('div');
  markerHtml.className = `marker-container ${isSelected ? 'selected' : ''}`;
  markerHtml.style.width = `${size}px`;
  markerHtml.style.height = `${size}px`;
  markerHtml.style.cursor = 'pointer';
  
  // Add the SVG content
  markerHtml.innerHTML = `
    <svg 
      width="${size}" 
      height="${size}" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style="pointer-events: auto;"
    >
      <path 
        d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" 
        fill="${color}"
      />
    </svg>
  `;

  return L.divIcon({
    html: markerHtml,
    className: 'custom-marker',
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
  console.log('ApplicationMarkers rendering with selectedId:', selectedId);
  
  return (
    <>
      {applications.map((app) => {
        if (!app.coordinates) {
          console.warn('Application missing coordinates:', app.id);
          return null;
        }

        const color = getStatusColor(app.status);
        const isSelected = app.id === selectedId;
        
        console.log(`Creating marker for app ${app.id}, selected: ${isSelected}`);
        
        return (
          <Marker
            key={app.id}
            position={app.coordinates}
            icon={createIcon(color, isSelected)}
            eventHandlers={{
              click: (e) => {
                console.log('Marker clicked:', app.id);
                e.originalEvent.stopPropagation();
                onMarkerClick(app.id);
              },
            }}
            zIndexOffset={isSelected ? 1000 : 0}
          />
        );
      })}
    </>
  );
};