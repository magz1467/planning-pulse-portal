import { MapContainer as LeafletMapContainer, TileLayer, useMap } from "react-leaflet";
import { Marker, Popup } from "react-leaflet";
import { ApplicationMarkers } from "./ApplicationMarkers";
import { searchIcon } from "./MapMarkers";
import { Application } from "@/types/planning";
import { LatLngTuple } from "leaflet";

// New component to handle map view updates
const MapUpdater = ({ center }: { center: LatLngTuple }) => {
  const map = useMap();
  
  // Update map view when center changes
  map.setView(center, map.getZoom());
  
  return null;
};

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
  const getZoomLevel = () => {
    if (applications.length <= 2) return 15;
    if (applications.length <= 5) return 14;
    return 13;
  };

  return (
    <div className="w-full h-full relative" style={{ zIndex: 0 }}>
      <LeafletMapContainer
        center={coordinates}
        zoom={getZoomLevel()}
        scrollWheelZoom={true}
        className="w-full h-full"
        style={{ position: 'absolute', inset: 0 }}
      >
        <MapUpdater center={coordinates} />
        
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