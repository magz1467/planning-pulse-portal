import { useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { useApplicationsData } from "./hooks/useApplicationsData";
import { MapView } from "./components/MapView";
import { ApplicationDetails } from "./components/ApplicationDetails";

export const ApplicationsDashboardMap = () => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { 
    applications, 
    isLoading, 
    fetchApplicationsInBounds 
  } = useApplicationsData();

  const handleMarkerClick = (id: number) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const selectedApplication = applications.find(app => app.id === selectedId);

  return (
    <div className="h-screen w-full flex">
      <div className="w-full h-full relative">
        <MapView
          applications={applications}
          selectedId={selectedId}
          onMarkerClick={handleMarkerClick}
          onBoundsChange={fetchApplicationsInBounds}
        />
      </div>

      {selectedApplication && (
        <ApplicationDetails application={selectedApplication} />
      )}
    </div>
  );
};