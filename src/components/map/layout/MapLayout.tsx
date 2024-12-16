import { Application } from "@/types/planning";
import { LatLngTuple } from "leaflet";
import { MobileApplicationCards } from "../MobileApplicationCards";
import { DesktopSidebar } from "../DesktopSidebar";
import { MapHeader } from "../MapHeader";
import { MapContainerComponent } from "../MapContainer";
import { LoadingOverlay } from "../LoadingOverlay";
import { FilterBar } from "../FilterBar";
import { MapListToggle } from "../mobile/MapListToggle";

interface MapLayoutProps {
  isLoading: boolean;
  coordinates: LatLngTuple;
  postcode: string;
  selectedApplication: number | null;
  filteredApplications: Application[];
  activeFilters: {
    status?: string;
    type?: string;
  };
  isMapView: boolean;
  isMobile: boolean;
  onMarkerClick: (id: number) => void;
  onFilterChange: (filterType: string, value: string) => void;
  onToggleView: () => void;
}

export const MapLayout = ({
  isLoading,
  coordinates,
  postcode,
  selectedApplication,
  filteredApplications,
  activeFilters,
  isMapView,
  isMobile,
  onMarkerClick,
  onFilterChange,
  onToggleView,
}: MapLayoutProps) => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {isLoading && <LoadingOverlay />}
      <MapHeader />
      
      {isMobile && (
        <div className="flex items-center justify-between px-4 py-2 bg-white border-b">
          <FilterBar
            onFilterChange={onFilterChange}
            activeFilters={activeFilters}
          />
          <MapListToggle
            isMapView={isMapView}
            onToggle={onToggleView}
          />
        </div>
      )}
      
      <div className="flex flex-1 overflow-hidden relative">
        {!isMobile && (
          <DesktopSidebar
            applications={filteredApplications}
            selectedApplication={selectedApplication}
            postcode={postcode}
            activeFilters={activeFilters}
            onFilterChange={onFilterChange}
            onSelectApplication={onMarkerClick}
            onClose={() => onMarkerClick(null)}
          />
        )}
        
        <div className={`flex-1 h-full relative ${!isMapView && isMobile ? 'hidden' : ''}`}>
          <MapContainerComponent
            coordinates={coordinates}
            postcode={postcode}
            applications={filteredApplications}
            selectedApplication={selectedApplication}
            onMarkerClick={onMarkerClick}
          />

          {isMobile && selectedApplication !== null && (
            <MobileApplicationCards
              applications={filteredApplications}
              selectedId={selectedApplication}
              onSelectApplication={onMarkerClick}
            />
          )}
        </div>
        
        {isMobile && !isMapView && (
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="bg-white p-4 rounded-lg shadow-sm mb-4 cursor-pointer"
                onClick={() => onMarkerClick(app.id)}
              >
                <h3 className="font-semibold text-primary">{app.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{app.address}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs bg-primary-light text-primary px-2 py-1 rounded">
                    {app.status}
                  </span>
                  <span className="text-xs text-gray-500">{app.distance}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};