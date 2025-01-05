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
  return L.divIcon({
    className: 'bg-transparent',
    html: `<svg width="${isSelected ? '32' : '20'}" height="${isSelected ? '32' : '20'}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="${color}"/>
    </svg>`,
    iconSize: [isSelected ? 32 : 20, isSelected ? 32 : 20],
    iconAnchor: [isSelected ? 16 : 10, isSelected ? 32 : 20],
  });
};

export const ApplicationMarkers = ({
  applications,
  baseCoordinates,
  onMarkerClick,
  selectedId,
}: ApplicationMarkersProps) => {
  const generateRandomCoordinates = (index: number): LatLngTuple => {
    // Use a seeded random-like approach based on the index
    const angle = (index * Math.PI * 0.08) % (2 * Math.PI); // Distribute evenly in a circle
    const distance = (0.005 + (index % 5) * 0.002); // Vary the distance from center in concentric rings
    
    const latOffset = distance * Math.cos(angle);
    const lngOffset = distance * Math.sin(angle);

    return [
      baseCoordinates[0] + latOffset,
      baseCoordinates[1] + lngOffset
    ];
  };

  const applicationCoordinates = useMemo(() => {
    return applications.map((_, index) => generateRandomCoordinates(index));
  }, [applications.length, baseCoordinates]);

  return (
    <>
      {applications.map((app, index) => {
        const color = getStatusColor(app.status);
        const isSelected = app.id === selectedId;
        return (
          <Marker
            key={app.id}
            position={applicationCoordinates[index]}
            eventHandlers={{
              click: () => onMarkerClick(app.id),
            }}
            icon={createIcon(color, isSelected)}
          />
        );
      })}
    </>
  );
};