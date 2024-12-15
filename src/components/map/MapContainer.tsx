import { MapContainer as LeafletMapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import { ApplicationMarkers } from "./ApplicationMarkers";
import { searchIcon } from "./MapMarkers";
import { Application } from "@/types/planning";
import { LatLngTuple } from "leaflet";

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
    <LeafletMapContainer
      center={coordinates}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100%" }}
    >
      <ZoomControl position="bottomright" />
      
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <Marker 
        position={coordinates}
        icon={searchIcon}
      >
        <Popup>Search Location: {postcode}</Popup>
      </Marker>
      
      <ApplicationMarkers
        applications={applications}
        baseCoordinates={coordinates}
        onMarkerClick={onMarkerClick}
        selectedId={selectedApplication}
      />
    </LeafletMapContainer>
  );
};