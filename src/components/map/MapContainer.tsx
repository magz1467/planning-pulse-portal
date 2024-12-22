import { Application } from "@/types/planning";
import { LatLngTuple } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import { ApplicationMarkers } from "./ApplicationMarkers";

interface MapContainerComponentProps {
  coordinates: LatLngTuple;
  postcode: string;
  applications: Application[];
  selectedApplication: number | null;
  onMarkerClick: (id: number) => void;
}

export const MapContainerComponent = ({
  coordinates,
  applications,
  selectedApplication,
  onMarkerClick,
}: MapContainerComponentProps) => {
  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={coordinates}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <ApplicationMarkers
          applications={applications}
          baseCoordinates={coordinates}
          onMarkerClick={onMarkerClick}
          selectedId={selectedApplication}
        />
      </MapContainer>
    </div>
  );
};