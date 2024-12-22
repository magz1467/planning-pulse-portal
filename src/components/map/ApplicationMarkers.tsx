import { Marker } from "react-leaflet";
import { Application } from "@/types/planning";
import { LatLngTuple } from "leaflet";
import { applicationIcon, selectedApplicationIcon } from "./MapMarkers";
import { useMemo } from "react";

interface ApplicationMarkersProps {
  applications: Application[];
  baseCoordinates: LatLngTuple;
  onMarkerClick: (id: number) => void;
  selectedId: number | null;
}

export const ApplicationMarkers = ({
  applications,
  baseCoordinates,
  onMarkerClick,
  selectedId,
}: ApplicationMarkersProps) => {
  const generateRandomCoordinates = (index: number): LatLngTuple => {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 0.01;
    const latOffset = distance * Math.cos(angle);
    const lngOffset = distance * Math.sin(angle);

    return [
      baseCoordinates[0] + latOffset,
      baseCoordinates[1] + lngOffset
    ];
  };

  const applicationCoordinates = useMemo(() => {
    return applications.map((_, index) => generateRandomCoordinates(index));
  }, [applications.length, baseCoordinates[0], baseCoordinates[1]]);

  return (
    <>
      {applications.map((app, index) => (
        <Marker
          key={app.id}
          position={applicationCoordinates[index]}
          eventHandlers={{
            click: () => onMarkerClick(app.id),
          }}
          icon={app.id === selectedId ? selectedApplicationIcon : applicationIcon}
        />
      ))}
    </>
  );
};