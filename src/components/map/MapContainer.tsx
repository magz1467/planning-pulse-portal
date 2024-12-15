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
  // Determine zoom level based on number of applications
  const getZoomLevel = () => {
    if (applications.length <= 2) return 15; // Very close zoom for 1-2 applications
    if (applications.length <= 5) return 14; // Slightly zoomed out for 3-5 applications
    return 13; // Default zoom level for more applications
  };

  return (
    <div className="w-full h-full">
      <LeafletMapContainer
        center={coordinates}
        zoom={getZoomLevel()}
        scrollWheelZoom={true}
        className="w-full h-full"
        zoomControl={false}
      >
        <ZoomControl position="topleft" />
        
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
    </div>
  );
};