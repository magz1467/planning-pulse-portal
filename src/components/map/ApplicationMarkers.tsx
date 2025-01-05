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
  // Log the number of applications being processed
  console.log('ApplicationMarkers - Processing applications:', applications.length);

  const generateRandomCoordinates = (index: number): LatLngTuple => {
    // Increase the spread of markers by adjusting these multipliers
    const angle = (index * Math.PI * 0.2) % (2 * Math.PI); // More spread in the circle
    const distance = 0.002 + (index % 10) * 0.001; // Larger radius steps
    
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