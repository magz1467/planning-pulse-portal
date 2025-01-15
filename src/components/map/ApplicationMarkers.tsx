import { Marker } from "react-leaflet";
import { Application } from "@/types/planning";
import { LatLngTuple } from "leaflet";
import { useMemo, useCallback } from "react";
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

export const ApplicationMarkers = ({
  applications,
  onMarkerClick,
  selectedId,
}: ApplicationMarkersProps) => {
  const createIcon = useCallback((color: string, isSelected: boolean) => {
    const size = isSelected ? 40 : 24;
    return L.divIcon({
      html: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="z-index: ${isSelected ? 1000 : 1};">
        <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="${color}"/>
      </svg>`,
      iconSize: [size, size],
      iconAnchor: [size/2, size],
      className: `marker-icon-container ${isSelected ? 'selected' : ''}`,
    });
  }, []);

  const handleClick = useCallback((id: number) => (e: L.LeafletMouseEvent) => {
    e.originalEvent.stopPropagation();
    onMarkerClick(id);
  }, [onMarkerClick]);

  return (
    <>
      {applications.map((app) => {
        if (!app.coordinates) {
          console.warn('Missing coordinates for application:', app.id);
          return null;
        }

        const color = getStatusColor(app.status);
        const isSelected = app.id === selectedId;
        
        return (
          <Marker
            key={app.id}
            position={app.coordinates}
            eventHandlers={{
              click: handleClick(app.id),
            }}
            icon={createIcon(color, isSelected)}
            zIndexOffset={isSelected ? 1000 : 0}
          />
        );
      })}
    </>
  );
};