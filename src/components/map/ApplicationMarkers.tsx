import { Marker, Popup } from "react-leaflet";
import { Application } from "@/types/planning";
import { defaultIcon } from "./MapMarkers";
import type { LatLngTuple } from "leaflet";

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
  return (
    <>
      {applications.map((application) => {
        const offset = {
          lat: (application.id % 3 - 1) * 0.008,
          lng: (Math.floor(application.id / 3) - 1) * 0.008,
        };

        const position: LatLngTuple = [
          baseCoordinates[0] + offset.lat,
          baseCoordinates[1] + offset.lng,
        ];

        return (
          <Marker
            key={application.id}
            position={position}
            icon={defaultIcon}
            eventHandlers={{
              click: () => onMarkerClick(application.id),
            }}
          >
            <Popup>
              <div>
                <h3 className="font-semibold">{application.title}</h3>
                <p className="text-sm">{application.address}</p>
                <p className="text-xs mt-1">Status: {application.status}</p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};