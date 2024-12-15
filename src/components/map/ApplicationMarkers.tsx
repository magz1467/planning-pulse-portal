import { Marker, Popup } from "react-leaflet";
import { Application } from "@/types/planning";
import { LatLngTuple } from "leaflet";
import { applicationIcon } from "./MapMarkers";

interface ApplicationMarkersProps {
  applications: Application[];
  baseCoordinates: LatLngTuple;
  onMarkerClick: (id: number) => void;
}

export const ApplicationMarkers = ({
  applications,
  baseCoordinates,
  onMarkerClick,
}: ApplicationMarkersProps) => {
  // Function to generate mock coordinates around the base location
  const generateCoordinates = (index: number): LatLngTuple => {
    const offset = 0.002 * index;
    return [baseCoordinates[0] + offset, baseCoordinates[1] + offset];
  };

  return (
    <>
      {applications.map((app, index) => (
        <Marker
          key={app.id}
          position={generateCoordinates(index)}
          eventHandlers={{
            click: () => onMarkerClick(app.id),
          }}
          icon={applicationIcon}
        >
          <Popup>
            <div>
              <h3 className="font-semibold">{app.title}</h3>
              <p className="text-sm">{app.address}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};