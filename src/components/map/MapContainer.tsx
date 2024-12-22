import { Application } from "@/types/planning";
import { LatLngTuple } from "leaflet";
import { MapContainer, TileLayer, MapContainerProps } from "react-leaflet";
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
  postcode,
  applications,
  selectedApplication,
  onMarkerClick,
}: MapContainerComponentProps) => {
  return (
    <div className="w-full h-full relative" style={{ zIndex: 0 }}>
      <MapContainer
        center={coordinates}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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