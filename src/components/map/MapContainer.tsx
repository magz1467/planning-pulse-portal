import { Application } from "@/types/planning";
import { LatLngTuple } from "leaflet";
import { GoogleMapComponent } from "./GoogleMapComponent";

interface MapContainerProps {
  coordinates: LatLngTuple;
  postcode: string;
  applications: Application[];
  selectedApplication: number | null;
  onMarkerClick: (id: number) => void;
}

export const MapContainerComponent = ({
  coordinates,
  postcode,
  applications,
  selectedApplication,
  onMarkerClick,
}: MapContainerProps) => {
  return (
    <div className="w-full h-full relative" style={{ zIndex: 0 }}>
      <GoogleMapComponent
        coordinates={coordinates}
        applications={applications}
        selectedApplication={selectedApplication}
        onMarkerClick={onMarkerClick}
        postcode={postcode}
      />
    </div>
  );
};