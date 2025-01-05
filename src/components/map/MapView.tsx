import { Application } from "@/types/planning";
import { LatLngTuple } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import { ApplicationMarkers } from "@/components/map/ApplicationMarkers";
import { SearchLocationPin } from "@/components/map/SearchLocationPin";
import { useEffect } from 'react';
import "leaflet/dist/leaflet.css";

interface MapViewProps {
  applications: Application[];
  selectedId: number | null;
  onMarkerClick: (id: number) => void;
  initialCenter: LatLngTuple;
}

export const MapView = ({
  applications,
  selectedId,
  onMarkerClick,
  initialCenter
}: MapViewProps) => {
  // Log the number of visible applications for debugging
  useEffect(() => {
    console.log('MapView - Number of applications:', applications.length);
  }, [applications]);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={initialCenter}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer 
          url="https://api.mapbox.com/styles/v1/mapbox/light-v11/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoicGxhbm5pbmdwdWxzZSIsImEiOiJjbHJxOGFvYmkwMXZvMmpxcjRhOWNqZWd2In0.ED6Yu4K5VzgyuDtXVQ_YNg"
          attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          maxZoom={19}
        />
        <SearchLocationPin position={initialCenter as [number, number]} />
        <ApplicationMarkers
          applications={applications}
          baseCoordinates={initialCenter}
          onMarkerClick={onMarkerClick}
          selectedId={selectedId}
        />
      </MapContainer>
    </div>
  );
};