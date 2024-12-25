import { Application } from "@/types/planning";
import { MapHeader } from "./MapHeader";
import { DesktopSidebar } from "./DesktopSidebar";
import { MapContainerComponent } from "./MapContainer";
import { MobileApplicationCards } from "./MobileApplicationCards";
import { LoadingOverlay } from "./LoadingOverlay";

interface MapContentLayoutProps {
  isLoading: boolean;
  coordinates: [number, number];
  postcode: string;
  selectedApplication: number | null;
  filteredApplications: Application[];
  activeFilters: {
    status?: string;
    type?: string;
  };
  activeSort: 'closingSoon' | 'newest' | null;
  isMapView: boolean;
  isMobile: boolean;
  onMarkerClick: (id: number) => void;
  onFilterChange: (filterType: string, value: string) => void;
  onSortChange: (sortType: 'closingSoon' | 'newest' | null) => void;
  onToggleView: () => void;
}

export const MapContentLayout = ({
  isLoading,
  coordinates,
  postcode,
  selectedApplication,
  filteredApplications,
  activeFilters,
  activeSort,
  isMapView,
  isMobile,
  onMarkerClick,
  onFilterChange,
  onSortChange,
  onToggleView,
}: MapContentLayoutProps) => {
  if (!coordinates) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] w-full overflow-hidden">
      {isLoading && <LoadingOverlay />}
      
      <MapHeader 
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
        activeFilters={activeFilters}
        activeSort={activeSort}
        isMapView={isMapView}
        onToggleView={onToggleView}
      />
      
      <div className="flex flex-1 min-h-0 relative">
        {!isMobile && (
          <DesktopSidebar
            applications={filteredApplications}
            selectedApplication={selectedApplication}
            postcode={postcode}
            activeFilters={activeFilters}
            activeSort={activeSort}
            onFilterChange={onFilterChange}
            onSortChange={onSortChange}
            onSelectApplication={onMarkerClick}
            onClose={() => onMarkerClick(null)}
          />
        )}
        
        <div 
          className={`flex-1 relative ${isMobile ? (isMapView ? 'block' : 'hidden') : 'block'}`}
          style={{ 
            height: isMobile ? 'calc(100vh - 120px)' : '100%',
            width: '100%'
          }}
        >
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
          <div className="absolute inset-0 flex flex-col bg-gray-50">
            <div className="flex-1 overflow-y-auto overscroll-contain pb-safe">
              <div className="p-4 space-y-4">
                {filteredApplications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white p-4 rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => onMarkerClick(app.id)}
                  >
                    <div className="flex gap-4">
                      {app.image && (
                        <div className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                          <img
                            src={app.image}
                            alt={app.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-primary truncate">{app.title}</h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{app.address}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${app.status === 'approved' ? 'bg-green-100 text-green-800' : app.status === 'declined' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                            {app.status}
                          </span>
                          <span className="text-xs text-gray-500">{app.distance}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};